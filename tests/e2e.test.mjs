import test from "node:test";
import assert from "node:assert/strict";
import { createOfflineMeridianRuntime } from "../apps/control-plane-api/dist/bootstrap.js";
import { LedgerInvariantAuditor } from "../packages/ledger-engine/dist/invariant-auditor.js";
import { Money } from "../packages/domain-core/dist/money.js";

test("Money.allocateByWeights conserves exact micro-units with zero drift", () => {
  const total = Money.fromMicro(1_000_001n, "GBP");
  const splits = total.allocateByWeights([1n, 1n, 1n]);
  const sum = splits.reduce((acc, m) => acc + m.microUnits, 0n);
  assert.equal(sum, total.microUnits);
});

test("End-to-end offline VPP frequency drop -> dispatch -> anomaly quarantine -> settlement", async () => {
  const runtime = createOfflineMeridianRuntime(200);
  const t0 = Date.now();

  await runtime.ingestor.ingest(runtime.fleet.tick(5, t0));
  assert.ok(runtime.anomalyDetector.getQuarantinedDevices().length > 0, "Spoofing inverters must be quarantined");

  const dropTick = runtime.market.createFrequencyDropEvent("UK-NORTH", 49_700, 400_000n);
  await runtime.broker.publish("grid.frequency", "UK-NORTH", dropTick);

  const sagas = runtime.sagaCoordinator.getSagas();
  assert.equal(sagas.length, 1);
  const saga = sagas[0];
  assert.equal(saga.state, "DISPATCHING");

  await runtime.ingestor.ingest(runtime.fleet.tick(450, t0 + 450_000));
  await runtime.ingestor.ingest(runtime.fleet.tick(450, t0 + 900_000));

  const participants = runtime.orchestrator.getDispatchParticipants(saga.dispatchId);
  assert.ok(participants.length > 0, "Cohort devices must accept signed commands");

  await runtime.broker.publish("dispatch.window.closed", saga.regionId, {
    dispatchId: saga.dispatchId,
    bidId: saga.bidId,
    regionId: saga.regionId,
    clearingPriceMicroPerKwh: saga.clearingPriceMicroPerKwh,
    promisedEnergyWh: (saga.targetPowerW * saga.durationSec) / 3600,
    startTsMs: t0,
    endTsMs: t0 + 900_000,
    participantDeviceIds: participants
  });

  const audit = LedgerInvariantAuditor.audit(runtime.ledger);
  assert.equal(audit.passed, true);
  assert.equal(audit.entriesAudited, 1);
  assert.equal(audit.globalDebitMicro, audit.globalCreditMicro);
});
