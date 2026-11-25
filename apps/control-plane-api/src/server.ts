import { createServer, type IncomingMessage, type ServerResponse, type Server } from "node:http";
import type { RegionId } from "@meridian/domain-core";
import type { PartitionedEventBroker } from "@meridian/event-bus";
import { LedgerInvariantAuditor, type DoubleEntryLedger } from "@meridian/ledger-engine";
import type { GridOrchestrator } from "@meridian/grid-orchestrator";
import type { BiddingSagaCoordinator, OfflineEnergyMarket } from "@meridian/market-bidding-engine";
import type { StreamAnomalyDetector } from "@meridian/anomaly-detector";

export interface ControlPlaneDeps {
  readonly broker: PartitionedEventBroker;
  readonly orchestrator: GridOrchestrator;
  readonly market: OfflineEnergyMarket;
  readonly sagaCoordinator: BiddingSagaCoordinator;
  readonly ledger: DoubleEntryLedger;
  readonly anomalyDetector: StreamAnomalyDetector;
}

/**
 * Zero-dependency Node HTTP Control Plane API with sliding-window rate limiting
 * and RFC 7807 JSON problem responses.
 */
export class ControlPlaneServer {
  private readonly deps: ControlPlaneDeps;
  private readonly requestBuckets: Map<string, number[]> = new Map();
  private readonly maxReqPerWindow = 120;
  private readonly windowMs = 60_000;
  private server?: Server;

  public constructor(deps: ControlPlaneDeps) {
    this.deps = deps;
  }

  private checkRateLimit(clientKey: string, nowMs: number): boolean {
    const timestamps = this.requestBuckets.get(clientKey) ?? [];
    const recent = timestamps.filter((t) => nowMs - t < this.windowMs);
    if (recent.length >= this.maxReqPerWindow) {
      this.requestBuckets.set(clientKey, recent);
      return false;
    }
    recent.push(nowMs);
    this.requestBuckets.set(clientKey, recent);
    return true;
  }

  private sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
    const payload = JSON.stringify(body, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
    res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
    res.end(payload);
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const clientIp = req.socket.remoteAddress ?? "local";
    if (!this.checkRateLimit(clientIp, Date.now())) {
      this.sendJson(res, 429, {
        type: "https://meridian.local/errors/rate-limit",
        title: "Too Many Requests",
        status: 429
      });
      return;
    }

    const url = new URL(req.url ?? "/", "http://localhost");
    const method = req.method ?? "GET";

    if (method === "GET" && url.pathname === "/v1/health") {
      this.sendJson(res, 200, {
        status: "ok",
        broker: this.deps.broker.getMetrics(),
        quarantinedDevices: this.deps.anomalyDetector.getQuarantinedDevices().length
      });
      return;
    }

    if (method === "GET" && url.pathname === "/v1/grid/capacity") {
      const region = (url.searchParams.get("region") ?? "UK-NORTH") as RegionId;
      this.sendJson(res, 200, this.deps.orchestrator.getRegionCapacity(region));
      return;
    }

    if (method === "GET" && url.pathname === "/v1/ledger/audit") {
      this.sendJson(res, 200, LedgerInvariantAuditor.audit(this.deps.ledger));
      return;
    }

    if (method === "GET" && url.pathname === "/v1/sagas") {
      this.sendJson(res, 200, { sagas: this.deps.sagaCoordinator.getSagas() });
      return;
    }

    if (method === "POST" && url.pathname === "/v1/market/trigger-drop") {
      const region = (url.searchParams.get("region") ?? "UK-NORTH") as RegionId;
      const tick = this.deps.market.createFrequencyDropEvent(region, 49_700, 410_000n);
      await this.deps.broker.publish("grid.frequency", region, tick);
      this.sendJson(res, 202, { triggered: true, tick });
      return;
    }

    this.sendJson(res, 404, {
      type: "https://meridian.local/errors/not-found",
      title: "Not Found",
      status: 404,
      detail: `No route matched ${method} ${url.pathname}`
    });
  }

  public start(port = 8080): Promise<number> {
    return new Promise((resolve) => {
      this.server = createServer((req, res) => {
        void this.handleRequest(req, res);
      });
      this.server.listen(port, "127.0.0.1", () => {
        const addr = this.server?.address();
        const boundPort = typeof addr === "object" && addr ? addr.port : port;
        resolve(boundPort);
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) return resolve();
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}
