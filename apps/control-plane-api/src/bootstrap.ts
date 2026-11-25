import { DispatchCommandSigner } from "@meridian/crypto-auth";
import { PartitionedEventBroker, TransactionalOutbox } from "@meridian/event-bus";
import { TimeSeriesEngine } from "@meridian/ts-storage";
import { DistributedLeaseManager } from "@meridian/distributed-lock";
import { DoubleEntryLedger, LedgerInvariantAuditor } from "@meridian/ledger-engine";
import { VirtualEdgeFleet } from "@meridian/edge-fleet-simulator";
import { TelemetryIngestor } from "@meridian/telemetry-ingestor";
import { StreamAnomalyDetector } from "@meridian/anomaly-detector";
import { GridOrchestrator } from "@meridian/grid-orchestrator";
import { OfflineEnergyMarket, BiddingSagaCoordinator } from "@meridian/market-bidding-engine";
import { MicroSettlementService } from "@meridian/settlement-service";
import { ControlPlaneServer } from "./server.js";

export interface MeridianRuntime {
  readonly broker: PartitionedEventBroker;
  readonly tsdb: TimeSeriesEngine;
  readonly ledger: DoubleEntryLedger;
  readonly fleet: VirtualEdgeFleet;
  readonly ingestor: TelemetryIngestor;
  readonly anomalyDetector: StreamAnomalyDetector;
  readonly orchestrator: GridOrchestrator;
  readonly market: OfflineEnergyMarket;
  readonly sagaCoordinator: BiddingSagaCoordinator;
  readonly settlement: MicroSettlementService;
  readonly server: ControlPlaneServer;
}

/**
 * Boots the complete offline Meridian VPP runtime in-process with zero external services.
 */
export function createOfflineMeridianRuntime(fleetSize = 200): MeridianRuntime {
  const signer = new DispatchCommandSigner();
  const broker = new PartitionedEventBroker({ partitionCount: 4 });
  const outbox = new TransactionalOutbox(broker);
  const tsdb = new TimeSeriesEngine();
  const leaseManager = new DistributedLeaseManager();
  const ledger = new DoubleEntryLedger();

  const fleet = new VirtualEdgeFleet(signer, { fleetSize, spoofRate: 0.03, dropRate: 0.01 });
  const profiles = fleet.getProfiles();

  const ingestor = new TelemetryIngestor(broker, tsdb, 250);
  const anomalyDetector = new StreamAnomalyDetector(broker, profiles);
  const orchestrator = new GridOrchestrator({
    broker,
    leaseManager,
    signer,
    profiles,
    commandSink: (cmd) => fleet.handleCommand(cmd)
  });

  const market = new OfflineEnergyMarket();
  const sagaCoordinator = new BiddingSagaCoordinator({
    broker,
    orchestrator,
    market,
    outbox
  });

  const settlement = new MicroSettlementService({
    broker,
    tsdb,
    ledger,
    outbox,
    profiles,
    isQuarantined: (id) => anomalyDetector.isQuarantined(id)
  });

  const server = new ControlPlaneServer({
    broker,
    orchestrator,
    market,
    sagaCoordinator,
    ledger,
    anomalyDetector
  });

  return {
    broker,
    tsdb,
    ledger,
    fleet,
    ingestor,
    anomalyDetector,
    orchestrator,
    market,
    sagaCoordinator,
    settlement,
    server
  };
}

/**
 * Runs a full offline simulation cycle when executed directly via CLI.
 */
async function main(): Promise<void> {
  const runtime = createOfflineMeridianRuntime(400);
  const t0 = Date.now();

  // 1. Ingest baseline telemetry
  await runtime.ingestor.ingest(runtime.fleet.tick(5, t0));

  // 2. Simulate grid frequency drop in UK-NORTH
  const tick = runtime.market.createFrequencyDropEvent("UK-NORTH", 49_710, 420_000n);
  await runtime.broker.publish("grid.frequency", "UK-NORTH", tick);

  // 3. Advance fleet 15 minutes during active discharge
  const t1 = t0 + 450_000;
  const t2 = t0 + 900_000;
  await runtime.ingestor.ingest(runtime.fleet.tick(450, t1));
  await runtime.ingestor.ingest(runtime.fleet.tick(450, t2));

  // 4. Close dispatch window and run double-entry settlement
  const sagas = runtime.sagaCoordinator.getSagas();
  const activeSaga = sagas[0];
  if (activeSaga) {
    const participants = runtime.orchestrator.getDispatchParticipants(activeSaga.dispatchId);
    await runtime.broker.publish("dispatch.window.closed", activeSaga.regionId, {
      dispatchId: activeSaga.dispatchId,
      bidId: activeSaga.bidId,
      regionId: activeSaga.regionId,
      clearingPriceMicroPerKwh: activeSaga.clearingPriceMicroPerKwh ?? 420_000n,
      promisedEnergyWh: (activeSaga.targetPowerW * activeSaga.durationSec) / 3600,
      startTsMs: t0,
      endTsMs: t2,
      participantDeviceIds: participants
    });
  }

  const audit = LedgerInvariantAuditor.audit(runtime.ledger);
  console.log("[MERIDIAN] Offline cycle complete:", {
    sagasExecuted: sagas.length,
    quarantinedDevices: runtime.anomalyDetector.getQuarantinedDevices().length,
    auditPassed: audit.passed,
    entriesAudited: audit.entriesAudited
  });

  const port = await runtime.server.start(8080);
  console.log(`[MERIDIAN] Control Plane API listening offline on http://127.0.0.1:${port}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
