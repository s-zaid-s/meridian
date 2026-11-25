# MERIDIAN — Pure TypeScript Offline VPP & Energy Trading Monorepo

Meridian is a zero-external-dependency, 100% TypeScript backend monorepo implementing a distributed Virtual Power Plant (VPP) orchestration platform, real-time telemetry ingestion pipeline, anomaly detector, algorithmic market bidding Saga coordinator, and ACID double-entry financial settlement engine.

## Offline-First Design
Every infrastructure primitive—normally delegated to Kafka, TimescaleDB, Redis, EMQX, and PostgreSQL—is implemented natively in strict TypeScript using only Node.js built-in modules (`node:http`, `node:crypto`, `node:fs`, `node:events`, `node:test`).

## Quick Start (100% Offline)
1. Install TypeScript once (or use a cached offline pnpm store): `pnpm install --offline`
2. Compile the entire monorepo: `pnpm run build`
3. Boot the complete simulated VPP & Control Plane API: `pnpm run start:offline`
4. Run the end-to-end integration test suite: `pnpm test`

See `roadmap.md` for the complete 105-ticket engineering backlog.
