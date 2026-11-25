# MERIDIAN — 105-Ticket AI Engineering Roadmap

> **Project:** Meridian (100% Offline, Pure-TypeScript Distributed Virtual Power Plant & Real-Time Energy Trading Monorepo)
> **Scope:** 105 implementation tickets across 10 epics (~3–4 hours of AI programmer effort per ticket)
> **Constraints:** Strict TypeScript only, Node.js built-ins only, zero external runtime dependencies, 100% offline execution.

---

## Epic Index

| Epic | Focus Area | Ticket Range |
| :--- | :--- | :--- |
| **1** | Epic 1: Domain Core, Physics & Fixed-Point Math | `MRD-001` – `MRD-010` (10 tickets) |
| **2** | Epic 2: Cryptographic Auth, PKI & Zero-Trust Edge Security | `MRD-011` – `MRD-020` (10 tickets) |
| **3** | Epic 3: Partitioned WAL Event Broker & Messaging | `MRD-021` – `MRD-030` (10 tickets) |
| **4** | Epic 4: Pure-TS Time-Series Storage Engine | `MRD-031` – `MRD-040` (10 tickets) |
| **5** | Epic 5: Distributed Locking, Leases & Consensus Primitives | `MRD-041` – `MRD-050` (10 tickets) |
| **6** | Epic 6: Double-Entry Ledger & Financial Settlement Engine | `MRD-051` – `MRD-060` (10 tickets) |
| **7** | Epic 7: Edge Fleet Simulator & High-Throughput Telemetry Ingestor | `MRD-061` – `MRD-070` (10 tickets) |
| **8** | Epic 8: Stream Anomaly Detection & Anti-Spoofing Intelligence | `MRD-071` – `MRD-080` (10 tickets) |
| **9** | Epic 9: Grid Orchestration, Market Bidding & Saga Resilience | `MRD-081` – `MRD-090` (10 tickets) |
| **10** | Epic 10: Control Plane API, Observability, Chaos & Packaging | `MRD-091` – `MRD-105` (15 tickets) |

---

## Epic 1: Domain Core, Physics & Fixed-Point Math

### [MRD-001] Implement Multi-Currency FX Rate Snapshot & Cross-Currency Money Conversion
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/fx-converter.ts`

#### Description
Add deterministic BigInt FX conversion between GBP, EUR, and USD using immutable rate snapshots with basis-point spreads and banker's rounding. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/fx-converter.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero floating-point ops; round-trip spread invariants hold; rejects stale FX snapshots beyond configurable TTL.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Multi-Currency FX Rate Snapshot & Cross-Currency Money Conversion` in `packages/domain-core/src/fx-converter.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/fx-converter.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-001`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `fx-converter.test.ts: converts GBP->EUR->GBP within spread bounds, throws on negative/zero rates, rejects expired snapshots.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-002] Build Non-Linear Lithium-Ion Peukert Capacity & Voltage Sag Model
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/peukert-model.ts`

#### Description
Extend BatteryPhysicsModel to simulate Peukert's law effective capacity reduction under high C-rate discharge and terminal voltage sag. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/peukert-model.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: High C-rates (>1.0C) reduce usable Wh non-linearly; voltage never drops below cutoff threshold without triggering protection.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Non-Linear Lithium-Ion Peukert Capacity & Voltage Sag Model` in `packages/domain-core/src/peukert-model.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/peukert-model.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-002`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `peukert-model.test.ts: verifies 0.2C vs 1.5C capacity curves, cutoff voltage trip, and monotonic sag monotonicity.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-003] Implement Calendar Aging & Cycle-Count State-of-Health (SoH) Estimator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/soh-estimator.ts`

#### Description
Track cumulative throughput Wh, depth-of-discharge histogram, and temperature stress to compute real-time battery State of Health (SoH %). Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/soh-estimator.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: SoH degrades monotonically with throughput and high-temp dwell time; integrates into headroom calculation.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Calendar Aging & Cycle-Count State-of-Health (SoH) Estimator` in `packages/domain-core/src/soh-estimator.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/soh-estimator.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-003`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `soh-estimator.test.ts: 1000 simulated full cycles reduce SoH within expected 85%-92% band; high-temp accelerates decay.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-004] Add Three-Phase AC Apparent/Reactive Power & Power Factor Math
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/ac-power.ts`

#### Description
Support kW (active), kVAR (reactive), kVA (apparent) power triangles and inverter power-factor curtailment rules for grid voltage support. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/ac-power.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: S^2 = P^2 + Q^2 invariant holds within 1 VA; reactive power injection obeys inverter kVA ceiling.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Three-Phase AC Apparent/Reactive Power & Power Factor Math` in `packages/domain-core/src/ac-power.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/ac-power.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-004`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ac-power.test.ts: validates power factor 0.85 lagging/leading, kVA clipping, and phase-angle bounds.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-005] Create Deterministic PRNG & Seeded Simulation Clock
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/sim-clock.ts`

#### Description
Implement a Mulberry32/Xoshiro128** seeded PRNG and controllable virtual SimulationClock so all offline chaos and market runs are 100% reproducible. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/sim-clock.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Identical seeds yield bit-identical sequences across runs; virtual clock supports fast-forwarding and pausing.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Create Deterministic PRNG & Seeded Simulation Clock` in `packages/domain-core/src/sim-clock.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/sim-clock.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-005`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `sim-clock.test.ts: two instances with seed 42 produce identical 10,000-element streams; clock step advances timers deterministically.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-006] Implement Regional Grid Tariff & Time-of-Use (ToU) Schedule Engine
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/tariff-engine.ts`

#### Description
Model half-hourly UK/EU import/export tariffs, peak/off-peak windows, and negative-pricing plunge events using BigInt micro-units. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/tariff-engine.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Resolves tariff rate for any UTC timestamp and RegionId in O(log n); handles DST transitions cleanly.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Regional Grid Tariff & Time-of-Use (ToU) Schedule Engine` in `packages/domain-core/src/tariff-engine.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/tariff-engine.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-006`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `tariff-engine.test.ts: tests peak/off-peak boundary timestamps, negative export pricing, and DST spring-forward/fall-back.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-007] Build Zod-Free Strict Runtime Schema Validator Library
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/validator.ts`

#### Description
Create a zero-dependency TypeScript runtime validator combinator library (string, number, bigint, literal, union, object, array) with typed ParseResult. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/validator.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Full TypeScript type inference (Infer<T>); detailed JSON-path error reporting; zero external packages.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Zod-Free Strict Runtime Schema Validator Library` in `packages/domain-core/src/validator.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/validator.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-007`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `validator.test.ts: validates nested telemetry payloads, rejects malformed types with exact field paths, checks BigInt parsing.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-008] Implement Solar Irradiance Clear-Sky & Cloud-Transient Physics Model
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/solar-model.ts`

#### Description
Compute expected solar PV output by latitude, day-of-year, solar elevation angle, and synthetic cloud-cover Markov chains for offline anomaly cross-checking. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/solar-model.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero generation at night; peaks at solar noon; Markov cloud state transitions produce realistic ramp rates.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Solar Irradiance Clear-Sky & Cloud-Transient Physics Model` in `packages/domain-core/src/solar-model.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/solar-model.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-008`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `solar-model.test.ts: verifies midnight=0W, summer solstice > winter solstice in UK-NORTH, and bounded ramp rates.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-009] Add Electric Vehicle (EV) V2G Departure-Time Constraint Solver
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/ev-v2g-solver.ts`

#### Description
Model bidirectional EV chargers where owners require a target SoC (e.g., 80%) by a departure deadline, computing safe V2G discharge windows. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/ev-v2g-solver.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Never schedules discharge that prevents reaching target SoC by departure time at maxChargeW.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Electric Vehicle (EV) V2G Departure-Time Constraint Solver` in `packages/domain-core/src/ev-v2g-solver.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/ev-v2g-solver.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-009`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ev-v2g-solver.test.ts: rejects discharge 30m before departure when SoC is low; permits discharge overnight with margin.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-010] Build Hierarchical Postal-Sector & Substation Topology Graph
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/domain-core/src/grid-topology.ts`

#### Description
Represent physical distribution network constraints (Primary Substation -> Feeder -> Postal Sector -> Device) with thermal line-limit caps. Implement this module in strict TypeScript inside `packages/domain-core` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/domain-core/src/grid-topology.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Detects feeder overload when aggregate discharge in a feeder exceeds transformer rating; supports O(1) parent lookup.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/domain-core/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Hierarchical Postal-Sector & Substation Topology Graph` in `packages/domain-core/src/grid-topology.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/domain-core/src/grid-topology.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/domain-core/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-010`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `grid-topology.test.ts: flags feeder congestion when 50 batteries discharge simultaneously on a 200kW feeder.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 2: Cryptographic Auth, PKI & Zero-Trust Edge Security

### [MRD-011] Implement Offline X.509-Style Device Certificate Authority & Chain Verifier
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/device-ca.ts`

#### Description
Build a pure-TS Ed25519 root/intermediate CA issuing signed JSON device certificates with validity windows, region claims, and serial numbers. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/device-ca.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Verifies full root -> regional CA -> device cert chains; rejects expired or wrong-region certs.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Offline X.509-Style Device Certificate Authority & Chain Verifier` in `packages/crypto-auth/src/device-ca.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/device-ca.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-011`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `device-ca.test.ts: issues 100 certs, verifies valid chain, rejects tampered claims, expired certs, and untrusted roots.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-012] Add Certificate Revocation List (CRL) & OCSP-Style Offline Staple Cache
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/revocation-store.ts`

#### Description
Support immediate cryptographic revocation of compromised inverters with signed delta CRLs propagated over the event bus. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/revocation-store.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Revoked devices fail verification within 1ms; CRL signature verified before applying updates.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Certificate Revocation List (CRL) & OCSP-Style Offline Staple Cache` in `packages/crypto-auth/src/revocation-store.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/revocation-store.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-012`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `revocation-store.test.ts: revokes active device, confirms immediate rejection, rejects unsigned CRL tampering.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-013] Implement Key Rotation & Dual-Key Grace-Period Command Signer
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/key-rotation.ts`

#### Description
Extend DispatchCommandSigner to support seamless Ed25519 key rotation using keyId headers and overlapping verification windows. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/key-rotation.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Commands signed by previous key remain valid during grace window; retired keys are strictly rejected.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Key Rotation & Dual-Key Grace-Period Command Signer` in `packages/crypto-auth/src/key-rotation.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/key-rotation.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-013`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `key-rotation.test.ts: rotates key mid-dispatch, verifies old+new commands during grace, rejects old key post-expiry.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-014] Build Persistent Bloom-Filter + LRU Nonce Replay Guard
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/replay-guard.ts`

#### Description
Replace simple Map nonce tracking with a time-bucketed rotating Bloom filter backed by an exact LRU cache for bounded memory under 50k msg/s. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/replay-guard.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero false negatives on replay within TTL window; memory usage stays strictly capped under 1M nonces.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Persistent Bloom-Filter + LRU Nonce Replay Guard` in `packages/crypto-auth/src/replay-guard.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/replay-guard.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-014`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `replay-guard.test.ts: detects 100% of replayed nonces, prunes expired buckets, bounds memory on 200k inserts.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-015] Implement Mutual HMAC-SHA256 Telemetry Frame Authentication
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/telemetry-mac.ts`

#### Description
Authenticate inbound inverter telemetry frames using per-device derived HKDF keys and constant-time HMAC verification. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/telemetry-mac.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Uses crypto.timingSafeEqual; rejects altered power/SoC values; derives keys deterministically from master secret.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Mutual HMAC-SHA256 Telemetry Frame Authentication` in `packages/crypto-auth/src/telemetry-mac.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/telemetry-mac.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-015`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `telemetry-mac.test.ts: detects single-bit flip in telemetry payload, validates HKDF derivation isolation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-016] Build Role-Based Access Control (RBAC) & Scoped API Token Engine
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/rbac-tokens.ts`

#### Description
Implement offline Ed25519-signed bearer tokens (JWT-compatible) with fine-grained scopes (grid:read, dispatch:override, ledger:audit). Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/rbac-tokens.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Validates signature, exp, nbf, aud, and required scopes; supports token revocation list.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Role-Based Access Control (RBAC) & Scoped API Token Engine` in `packages/crypto-auth/src/rbac-tokens.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/rbac-tokens.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-016`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `rbac-tokens.test.ts: allows operator scope on override route, denies readonly scope with 403 error code.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-017] Implement Tamper-Evident Hash-Chained Audit Log
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/audit-chain.ts`

#### Description
Record all administrative actions, manual dispatch overrides, and key rotations in a SHA-256 hash-chained append-only audit log. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/audit-chain.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Any historical mutation breaks chain verification and pinpoints the exact corrupted index.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Tamper-Evident Hash-Chained Audit Log` in `packages/crypto-auth/src/audit-chain.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/audit-chain.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-017`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `audit-chain.test.ts: appends 1,000 events, verifies intact chain, detects mid-chain payload alteration.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-018] Add Encrypted Local Secret Vault (AES-256-GCM)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/secret-vault.ts`

#### Description
Store offline private keys and master seeds encrypted on disk using scrypt key derivation and AES-256-GCM authenticated encryption. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/secret-vault.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Wrong passphrase fails authentication tag check; random IV generated on every write.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Encrypted Local Secret Vault (AES-256-GCM)` in `packages/crypto-auth/src/secret-vault.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/secret-vault.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-018`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `secret-vault.test.ts: encrypts/decrypts keypair round-trip, fails on wrong password or corrupted ciphertext.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-019] Implement Rate-Limited Proof-of-Work Onboarding Challenge for New Devices
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/onboarding-pow.ts`

#### Description
Protect device registration endpoints against Sybil flooding by requiring a lightweight SHA-256 leading-zero-bits puzzle during registration. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/onboarding-pow.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Server verifies solution in O(1); rejects reused challenge tokens or insufficient difficulty.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Rate-Limited Proof-of-Work Onboarding Challenge for New Devices` in `packages/crypto-auth/src/onboarding-pow.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/onboarding-pow.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-019`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `onboarding-pow.test.ts: solver finds valid nonce for 14-bit difficulty, verifier rejects tampered/replayed solutions.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-020] Build Signed Batch-Dispatch Merkle Tree Aggregator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/crypto-auth/src/merkle-dispatch.ts`

#### Description
Allow signing 10,000 device commands with a single Ed25519 root signature plus compact O(log N) Merkle inclusion proofs per device. Implement this module in strict TypeScript inside `packages/crypto-auth` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/crypto-auth/src/merkle-dispatch.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reduces signing CPU cost by >95% for large cohorts; every device independently verifies its inclusion proof.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/crypto-auth/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Signed Batch-Dispatch Merkle Tree Aggregator` in `packages/crypto-auth/src/merkle-dispatch.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/crypto-auth/src/merkle-dispatch.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/crypto-auth/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-020`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `merkle-dispatch.test.ts: builds 4,096-leaf dispatch tree, verifies valid proofs, rejects forged leaf power values.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 3: Partitioned WAL Event Broker & Messaging

### [MRD-021] Implement Binary Framed Append-Only Segment WAL with CRC32 Checksums
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/segment-wal.ts`

#### Description
Replace NDJSON WAL with length-prefixed binary log segments, automatic segment rotation at configurable byte limits, and CRC32 corruption checks. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/segment-wal.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Detects torn writes on crash recovery and truncates safely to last valid CRC32 frame.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Binary Framed Append-Only Segment WAL with CRC32 Checksums` in `packages/event-bus/src/segment-wal.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/segment-wal.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-021`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `segment-wal.test.ts: writes 10,000 frames across 3 segments, simulates torn tail write, recovers cleanly.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-022] Build Crash-Recovery Log Replay & Consumer Offset Checkpoint Store
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/offset-store.ts`

#### Description
Persist consumer group committed offsets atomically to disk using write-temp-and-rename so restarted consumers resume without data loss. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/offset-store.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Restarted consumer resumes from committedOffset + 1; supports seekToBeginning and seekToTimestamp.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Crash-Recovery Log Replay & Consumer Offset Checkpoint Store` in `packages/event-bus/src/offset-store.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/offset-store.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-022`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `offset-store.test.ts: commits offsets, reloads store from disk, verifies exact replay boundary.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-023] Implement Cooperative Consumer Group Rebalancer & Partition Assignment
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/rebalancer.ts`

#### Description
Support multiple consumer instances per group with sticky range partition assignment and heartbeat-based failure detection. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/rebalancer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Adding/removing a consumer instance rebalances partitions evenly with minimal partition movement.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Cooperative Consumer Group Rebalancer & Partition Assignment` in `packages/event-bus/src/rebalancer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/rebalancer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-023`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `rebalancer.test.ts: scales group from 1->3->2 consumers across 12 partitions, verifies zero unowned or double-owned partitions.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-024] Add Async Backpressure Queue & High-Watermark Pause/Resume
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/backpressure.ts`

#### Description
Prevent OOM when slow consumers fall behind by introducing per-partition bounded queues with pause/resume watermarks. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/backpressure.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Producer awaits drain when high watermark exceeded; resumes cleanly at low watermark with zero dropped events.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Async Backpressure Queue & High-Watermark Pause/Resume` in `packages/event-bus/src/backpressure.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/backpressure.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-024`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `backpressure.test.ts: slow consumer triggers pause, drains backlog, verifies 100% ordered delivery.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-025] Build Exponential Backoff Retry Scheduler & Delayed-Retry Topic
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/retry-scheduler.ts`

#### Description
Move failing consumer messages onto non-blocking delayed retry queues with jittered exponential backoff before final DLQ routing. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/retry-scheduler.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Failing message does not block subsequent partition messages; retries occur at 100ms, 400ms, 1600ms.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Exponential Backoff Retry Scheduler & Delayed-Retry Topic` in `packages/event-bus/src/retry-scheduler.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/retry-scheduler.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-025`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `retry-scheduler.test.ts: transient failure succeeds on attempt 3; permanent failure lands in DLQ with stack trace.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-026] Implement Dead Letter Queue (DLQ) Inspector & Selective Replay CLI Tool
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/dlq-replay.ts`

#### Description
Provide programmatic and CLI utilities to inspect DLQ records by topic/error code and replay fixed messages back to their source topic. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/dlq-replay.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Replayed messages carry incremented replayCount header and preserve original traceId.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Dead Letter Queue (DLQ) Inspector & Selective Replay CLI Tool` in `packages/event-bus/src/dlq-replay.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/dlq-replay.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-026`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `dlq-replay.test.ts: poisons 5 messages, replays 3 matching filter, confirms 2 remain in DLQ.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-027] Add Log Compaction Engine for Keyed State Topics
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/log-compactor.ts`

#### Description
Implement background log compaction retaining only the latest offset per key (plus tombstones) for device-profile and quarantine topics. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/log-compactor.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Compaction reduces segment size while preserving latest value for every active key and respecting tombstone retention.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Log Compaction Engine for Keyed State Topics` in `packages/event-bus/src/log-compactor.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/log-compactor.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-027`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `log-compactor.test.ts: writes 500 updates across 20 keys + 3 tombstones, compacts to 23 records.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-028] Implement Idempotent Producer Sequence Numbers & Duplicate Deduplication
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/idempotent-producer.ts`

#### Description
Assign monotonic (producerId, sequenceNumber) pairs so retried publishes are deduplicated at the broker before appending to the WAL. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/idempotent-producer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Duplicate sequence numbers return original offset without creating duplicate WAL entries.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Idempotent Producer Sequence Numbers & Duplicate Deduplication` in `packages/event-bus/src/idempotent-producer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/idempotent-producer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-028`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `idempotent-producer.test.ts: submits seq 1,2,2,3 -> WAL contains exactly 3 records with monotonic offsets.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-029] Build Transactional Multi-Topic Atomic Publish (2PC-Style Marker Log)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/tx-broker.ts`

#### Description
Allow producers to publish to multiple topics atomically using BEGIN/COMMIT/ABORT control markers; read_committed consumers ignore aborted records. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/tx-broker.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Aborted transactions are invisible to read_committed consumers; committed ones become visible atomically.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Transactional Multi-Topic Atomic Publish (2PC-Style Marker Log)` in `packages/event-bus/src/tx-broker.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/tx-broker.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-029`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `tx-broker.test.ts: tests committed vs aborted multi-topic batch visibility under read_committed isolation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-030] Add W3C Distributed Trace Context Propagation & Span Collector
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/event-bus/src/trace-context.ts`

#### Description
Propagate traceparent/spanId across every event publish and consume hop and collect in-memory flamegraph spans for offline latency profiling. Implement this module in strict TypeScript inside `packages/event-bus` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/event-bus/src/trace-context.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: End-to-end trace from telemetry ingest -> anomaly -> orchestrator -> settlement shares one traceId with parent-child links.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/event-bus/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add W3C Distributed Trace Context Propagation & Span Collector` in `packages/event-bus/src/trace-context.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/event-bus/src/trace-context.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/event-bus/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-030`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `trace-context.test.ts: asserts unbroken 4-hop span tree with accurate durationMs per hop.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 4: Pure-TS Time-Series Storage Engine

### [MRD-031] Implement Gorilla-Style Delta-of-Delta Timestamp & XOR Float Compression
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ts-storage/src/gorilla-codec.ts`

#### Description
Compress telemetry time-series blocks in pure TypeScript using delta-of-delta timestamps and bit-packed XOR encoding for power/voltage floats. Implement this module in strict TypeScript inside `packages/ts-storage` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ts-storage/src/gorilla-codec.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Achieves >=65% size reduction on realistic 2s inverter telemetry with bit-exact decompression.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ts-storage/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Gorilla-Style Delta-of-Delta Timestamp & XOR Float Compression` in `packages/ts-storage/src/gorilla-codec.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ts-storage/src/gorilla-codec.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ts-storage/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-031`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `gorilla-codec.test.ts: compresses/decompresses 10,000 samples bit-identically and asserts compression ratio > 2.5x.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-032] Build Time-Partitioned Chunk Manager with Disk Spillover & LRU Block Cache
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ts-storage/src/chunk-manager.ts`

#### Description
Partition time-series data into 1-hour immutable chunks that flush to local disk when closed, keeping hot chunks in an LRU cache. Implement this module in strict TypeScript inside `packages/ts-storage` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ts-storage/src/chunk-manager.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Queries spanning hot memory + cold disk chunks seamlessly merge results in chronological order.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ts-storage/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Time-Partitioned Chunk Manager with Disk Spillover & LRU Block Cache` in `packages/ts-storage/src/chunk-manager.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ts-storage/src/chunk-manager.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ts-storage/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-032`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `chunk-manager.test.ts: writes 4 hours of data, evicts oldest chunks to disk, queries full 4-hour range accurately.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-033] Implement Continuous Rollup Materialized Views (1m, 5m, 15m Buckets)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ts-storage/src/continuous-agg.ts`

#### Description
Maintain incrementally updated 1-minute and 15-minute rollups (min, max, avg, sumWh, sampleCount) per device and region. Implement this module in strict TypeScript inside `packages/ts-storage` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ts-storage/src/continuous-agg.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Rollup queries run in O(buckets) rather than O(raw samples); updates incrementally on every insertBatch.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ts-storage/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Continuous Rollup Materialized Views (1m, 5m, 15m Buckets)` in `packages/ts-storage/src/continuous-agg.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ts-storage/src/continuous-agg.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ts-storage/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-033`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `continuous-agg.test.ts: compares rollup sumWh against raw trapezoidal integration within 0.5% tolerance.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-034] Add Out-of-Order Telemetry Ingestion & Watermark-Based Window Finalization
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ts-storage/src/ooo-buffer.ts`

#### Description
Handle delayed/out-of-order edge telemetry arriving up to 30s late without corrupting sorted chunks or premature window integration. Implement this module in strict TypeScript inside `packages/ts-storage` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ts-storage/src/ooo-buffer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Late samples within watermark merge into exact timestamp order; samples past watermark are counted as dropped_late.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ts-storage/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Out-of-Order Telemetry Ingestion & Watermark-Based Window Finalization` in `packages/ts-storage/src/ooo-buffer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ts-storage/src/ooo-buffer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ts-storage/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-034`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ooo-buffer.test.ts: feeds shuffled timestamps within 20s skew, verifies strictly sorted query output.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-035] Build Inverted Tag Index (Region, PostalSector, FirmwareVersion)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ts-storage/src/tag-index.ts`

#### Description
Add roaring-style bitmap/set inverted index enabling fast multi-tag filtering across 50,000+ devices. Implement this module in strict TypeScript inside `packages/ts-storage` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ts-storage/src/tag-index.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Intersection query (region=UK-NORTH AND sector=S2) executes in <2ms across 50k indexed series.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ts-storage/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Inverted Tag Index (Region, PostalSector, FirmwareVersion)` in `packages/ts-storage/src/tag-index.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ts-storage/src/tag-index.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ts-storage/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-035`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `tag-index.test.ts: indexes 10,000 devices, runs AND/OR/NOT tag queries, verifies exact device sets.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-036] Implement Retention Policy Sweeper & Cold-Tier Downsampling Job
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ts-storage/src/retention-sweeper.ts`

#### Description
Automatically delete raw chunks older than retention TTL while preserving downsampled 15m summary chunks for historical audits. Implement this module in strict TypeScript inside `packages/ts-storage` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ts-storage/src/retention-sweeper.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reclaims disk/memory for expired raw chunks while keeping 15m rollups queryable.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ts-storage/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Retention Policy Sweeper & Cold-Tier Downsampling Job` in `packages/ts-storage/src/retention-sweeper.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ts-storage/src/retention-sweeper.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ts-storage/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-036`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `retention-sweeper.test.ts: simulates 72h clock advance, verifies raw chunks deleted and rollups intact.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-037] Add Write-Ahead Log & Crash Recovery for Unflushed Active Chunks
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ts-storage/src/tsdb-wal.ts`

#### Description
Persist active in-memory chunk writes to a local WAL so a sudden process exit never loses uncompacted telemetry. Implement this module in strict TypeScript inside `packages/ts-storage` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ts-storage/src/tsdb-wal.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Simulated crash before chunk flush recovers 100% of committed batches on restart.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ts-storage/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Write-Ahead Log & Crash Recovery for Unflushed Active Chunks` in `packages/ts-storage/src/tsdb-wal.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ts-storage/src/tsdb-wal.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ts-storage/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-037`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `tsdb-wal.test.ts: inserts 5 batches, re-instantiates engine from WAL directory, verifies all samples restored.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-038] Build Streaming Query Cursor & Windowed Aggregation Pipeline
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ts-storage/src/query-cursor.ts`

#### Description
Expose AsyncGenerator cursors for memory-safe streaming scans across millions of telemetry points with map/filter/reduce operators. Implement this module in strict TypeScript inside `packages/ts-storage` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ts-storage/src/query-cursor.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Scans 500k points with flat heap usage; supports early break/cancellation.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ts-storage/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Streaming Query Cursor & Windowed Aggregation Pipeline` in `packages/ts-storage/src/query-cursor.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ts-storage/src/query-cursor.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ts-storage/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-038`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `query-cursor.test.ts: streams 50k points via for-await-of, verifies early termination closes file handles.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-039] Implement Data Quality & Gap-Interpolation Engine for Settlement
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ts-storage/src/gap-interpolator.ts`

#### Description
Detect telemetry dropouts during dispatch windows; linearly interpolate gaps <15s and cap/zero unverified gaps >15s to prevent over-crediting. Implement this module in strict TypeScript inside `packages/ts-storage` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ts-storage/src/gap-interpolator.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Short 5s packet drop interpolates accurately; 60s blackout credits 0 Wh during blackout interval.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ts-storage/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Data Quality & Gap-Interpolation Engine for Settlement` in `packages/ts-storage/src/gap-interpolator.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ts-storage/src/gap-interpolator.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ts-storage/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-039`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `gap-interpolator.test.ts: tests 5s gap vs 60s gap integration outputs against analytical expectations.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-040] Add TSDB Storage Metrics & Query Execution Profiler
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ts-storage/src/profiler.ts`

#### Description
Instrument ingest rate, cache hit ratio, disk bytes written, and p50/p95/p99 query latency histograms. Implement this module in strict TypeScript inside `packages/ts-storage` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ts-storage/src/profiler.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Exports structured snapshot consumable by Control Plane API and CLI diagnostics.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ts-storage/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add TSDB Storage Metrics & Query Execution Profiler` in `packages/ts-storage/src/profiler.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ts-storage/src/profiler.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ts-storage/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-040`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `profiler.test.ts: executes 100 queries, verifies accurate hit ratio and p99 latency calculation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 5: Distributed Locking, Leases & Consensus Primitives

### [MRD-041] Implement Multi-Node Simulated Quorum Lock Manager (Redlock-Style)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/distributed-lock/src/quorum-lock.ts`

#### Description
Simulate N=5 independent lock shards requiring majority quorum (3/5) acquisition with clock-drift safety margins and automatic rollback on partial acquisition. Implement this module in strict TypeScript inside `packages/distributed-lock` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/distributed-lock/src/quorum-lock.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Survives up to 2 failed shards; automatically releases minority locks if quorum fails.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/distributed-lock/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Multi-Node Simulated Quorum Lock Manager (Redlock-Style)` in `packages/distributed-lock/src/quorum-lock.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/distributed-lock/src/quorum-lock.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/distributed-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-041`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `quorum-lock.test.ts: kills 2 of 5 shards -> lock succeeds; kills 3 of 5 -> lock fails cleanly with zero leaked locks.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-042] Add Lease Heartbeat Renewal & Watchdog Auto-Extension
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/distributed-lock/src/lease-watchdog.ts`

#### Description
Allow long-running dispatches to renew cohort leases safely using their fencing token before TTL expiration. Implement this module in strict TypeScript inside `packages/distributed-lock` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/distributed-lock/src/lease-watchdog.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Renewal fails if fencing token is stale or lease already expired; extends TTL atomically when valid.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/distributed-lock/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Lease Heartbeat Renewal & Watchdog Auto-Extension` in `packages/distributed-lock/src/lease-watchdog.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/distributed-lock/src/lease-watchdog.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/distributed-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-042`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `lease-watchdog.test.ts: renews lease 3 times across TTL boundary, rejects renewal with stale fencing token.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-043] Implement Wait-Die Deadlock Prevention & Priority Preemption for Grid Emergencies
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/distributed-lock/src/emergency-preempt.ts`

#### Description
Allow CRITICAL frequency-response reservations (<49.6 Hz) to preempt lower-priority arbitrage reservations with graceful revocation callbacks. Implement this module in strict TypeScript inside `packages/distributed-lock` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/distributed-lock/src/emergency-preempt.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Emergency reservation revokes arbitrage lease, invokes callback, and issues higher fencing token.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/distributed-lock/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Wait-Die Deadlock Prevention & Priority Preemption for Grid Emergencies` in `packages/distributed-lock/src/emergency-preempt.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/distributed-lock/src/emergency-preempt.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/distributed-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-043`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `emergency-preempt.test.ts: arbitrage lock preempted by emergency lock; old holder's fencing token rejected.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-044] Build Persistent Lease Journal for Crash-Safe Orchestrator Failover
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/distributed-lock/src/lease-journal.ts`

#### Description
Journal active cohort leases and fencing counter to disk so a restarted GridOrchestrator never resets fencing tokens or double-books active batteries. Implement this module in strict TypeScript inside `packages/distributed-lock` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/distributed-lock/src/lease-journal.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Fencing counter strictly increases across restarts; active non-expired leases reload intact.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/distributed-lock/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Persistent Lease Journal for Crash-Safe Orchestrator Failover` in `packages/distributed-lock/src/lease-journal.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/distributed-lock/src/lease-journal.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/distributed-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-044`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `lease-journal.test.ts: acquires lease with token #7, restarts manager, next token is #8 and cohort remains locked.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-045] Implement Fair Queued Lock Acquisition with Timeout & AbortSignal
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/distributed-lock/src/fair-lock-queue.ts`

#### Description
Support FIFO waiting queues for contested regional capacity locks with AbortSignal cancellation. Implement this module in strict TypeScript inside `packages/distributed-lock` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/distributed-lock/src/fair-lock-queue.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Waiters acquire in strict FIFO order; aborted waiters are immediately purged without leaking slots.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/distributed-lock/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Fair Queued Lock Acquisition with Timeout & AbortSignal` in `packages/distributed-lock/src/fair-lock-queue.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/distributed-lock/src/fair-lock-queue.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/distributed-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-045`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `fair-lock-queue.test.ts: 3 waiters queue; waiter #2 aborts; lock passes from #1 directly to #3.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-046] Add Regional Capacity Semaphore & Reservation Quota Guard
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/distributed-lock/src/capacity-semaphore.ts`

#### Description
Enforce per-market and per-region maximum commitment caps (e.g., never commit >80% of a region's MW to a single market) atomically. Implement this module in strict TypeScript inside `packages/distributed-lock` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/distributed-lock/src/capacity-semaphore.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Prevents single auction from exhausting 100% of reserve margin; releases permits on rollback.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/distributed-lock/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Regional Capacity Semaphore & Reservation Quota Guard` in `packages/distributed-lock/src/capacity-semaphore.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/distributed-lock/src/capacity-semaphore.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/distributed-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-046`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `capacity-semaphore.test.ts: 70% succeeds, concurrent 20% rejected under 80% cap, succeeds after release.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-047] Implement Split-Brain Partition Detector & Fencing Validator Middleware
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/distributed-lock/src/fencing-guard.ts`

#### Description
Track highest seen fencing token per device so edge simulators and orchestrators reject stale commands from partitioned zombie leaders. Implement this module in strict TypeScript inside `packages/distributed-lock` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/distributed-lock/src/fencing-guard.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Command with fencingToken 4 rejected after device has processed fencingToken 5.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/distributed-lock/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Split-Brain Partition Detector & Fencing Validator Middleware` in `packages/distributed-lock/src/fencing-guard.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/distributed-lock/src/fencing-guard.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/distributed-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-047`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `fencing-guard.test.ts: tests monotonic acceptance and strict rejection of out-of-order stale fencing tokens.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-048] Build Lock Contention Telemetry & Hotspot Analyzer
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/distributed-lock/src/contention-metrics.ts`

#### Description
Measure lock wait time, conflict rate per region, and top contended device cohorts. Implement this module in strict TypeScript inside `packages/distributed-lock` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/distributed-lock/src/contention-metrics.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Identifies hot devices with >10% conflict rate and exposes structured diagnostic report.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/distributed-lock/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Lock Contention Telemetry & Hotspot Analyzer` in `packages/distributed-lock/src/contention-metrics.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/distributed-lock/src/contention-metrics.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/distributed-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-048`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `contention-metrics.test.ts: simulates 500 concurrent lock attempts, validates conflict rate math.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-049] Implement Hierarchical Substation-Level Lock Tree
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/distributed-lock/src/hierarchical-lock.ts`

#### Description
Support intention locks (IS/IX) on regions/feeders combined with exclusive locks on individual batteries for safe maintenance windows. Implement this module in strict TypeScript inside `packages/distributed-lock` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/distributed-lock/src/hierarchical-lock.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Feeder maintenance exclusive lock blocks new battery reservations on that feeder until released.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/distributed-lock/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Hierarchical Substation-Level Lock Tree` in `packages/distributed-lock/src/hierarchical-lock.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/distributed-lock/src/hierarchical-lock.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/distributed-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-049`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `hierarchical-lock.test.ts: feeder maintenance lock blocks device lock; concurrent device locks coexist via IX.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-050] Add Deterministic Chaos Fault-Injector for Lock Delays & Clock Skew
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/distributed-lock/src/lock-chaos.ts`

#### Description
Inject configurable clock skew and GC-pause delays into lock shards during offline chaos testing. Implement this module in strict TypeScript inside `packages/distributed-lock` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/distributed-lock/src/lock-chaos.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Proves fencing tokens prevent double-dispatch even under 5-second simulated GC pause.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/distributed-lock/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Deterministic Chaos Fault-Injector for Lock Delays & Clock Skew` in `packages/distributed-lock/src/lock-chaos.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/distributed-lock/src/lock-chaos.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/distributed-lock/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-050`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `lock-chaos.test.ts: simulates GC pause past TTL, verifies zombie holder fails fencing check.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 6: Double-Entry Ledger & Financial Settlement Engine

### [MRD-051] Implement Append-Only Disk-Backed Ledger Store with SHA-256 Hash Chain
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/ledger-store.ts`

#### Description
Persist every committed JournalEntry to a tamper-evident hash-chained file and rebuild account balances on startup. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/ledger-store.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reloading from disk reproduces exact BigInt balances; tampering with any line fails startup integrity check.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Append-Only Disk-Backed Ledger Store with SHA-256 Hash Chain` in `packages/ledger-engine/src/ledger-store.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/ledger-store.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-051`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ledger-store.test.ts: posts 500 entries, restarts ledger from disk, verifies identical balances and chain hash.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-052] Build Optimistic Concurrency Control (OCC) & Serializable Retry Loop
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/occ-transaction.ts`

#### Description
Version every LedgerAccount and detect concurrent write conflicts during parallel batch settlements with automatic exponential retry. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/occ-transaction.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Concurrent debits on the same account never violate balance constraints or lose updates.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Optimistic Concurrency Control (OCC) & Serializable Retry Loop` in `packages/ledger-engine/src/occ-transaction.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/occ-transaction.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-052`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `occ-transaction.test.ts: fires 50 concurrent transfers between 5 accounts, verifies exact conservation of money.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-053] Implement Reversing & Adjusting Journal Entries (Immutable Corrections)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/reversal-engine.ts`

#### Description
Support settlement dispute corrections strictly via linked reversing journal entries—never mutating or deleting historical entries. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/reversal-engine.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reversal entry mirrors exact opposite debits/credits and links to original entryId; double-reversal is blocked.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Reversing & Adjusting Journal Entries (Immutable Corrections)` in `packages/ledger-engine/src/reversal-engine.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/reversal-engine.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-053`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `reversal-engine.test.ts: posts entry, reverses it, confirms net balance 0 and second reversal rejected.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-054] Add Tiered Platform Fee, VAT & Grid Non-Delivery Penalty Calculator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/fee-calculator.ts`

#### Description
Calculate volume-tiered platform fees, UK VAT (20%) on platform service fees, and proportional under-delivery penalties in exact BigInt micro-units. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/fee-calculator.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Net owner payout + platform fee + VAT + penalty === gross clearing revenue to the exact micro-unit.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Tiered Platform Fee, VAT & Grid Non-Delivery Penalty Calculator` in `packages/ledger-engine/src/fee-calculator.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/fee-calculator.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-054`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `fee-calculator.test.ts: tests 100% delivery, 75% under-delivery penalty, and 0% delivery edge cases.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-055] Build Account Statement Generator & Cursor-Paginated Ledger Query API
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/statement-service.ts`

#### Description
Generate running-balance account statements over date ranges with opening balance, itemized postings, and closing balance. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/statement-service.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: openingBalance + sum(credits) - sum(debits) === closingBalance for every paginated slice.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Account Statement Generator & Cursor-Paginated Ledger Query API` in `packages/ledger-engine/src/statement-service.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/statement-service.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-055`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `statement-service.test.ts: generates multi-page statement across 200 entries, verifies running balance continuity.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-056] Implement Multi-Currency Sub-Ledger & FX Revaluation Entry Generator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/fx-revaluation.ts`

#### Description
Support cross-border energy settlements (e.g., GBP/EUR interconnector) with realized FX gain/loss postings. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/fx-revaluation.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Multi-currency entries balance independently per currency using FX clearing bridge accounts.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Multi-Currency Sub-Ledger & FX Revaluation Entry Generator` in `packages/ledger-engine/src/fx-revaluation.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/fx-revaluation.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-056`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `fx-revaluation.test.ts: settles EUR wholesale trade to GBP asset owners with balanced FX bridge postings.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-057] Build Automated Payout Batch Aggregator & Minimum Threshold Sweeper
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/payout-sweeper.ts`

#### Description
Sweep accumulated asset owner micro-payouts above a configurable threshold (e.g., £5.00) into outbound settlement payout batches. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/payout-sweeper.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Moves funds from owner payable to payout-in-transit atomically; ignores accounts below threshold.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Automated Payout Batch Aggregator & Minimum Threshold Sweeper` in `packages/ledger-engine/src/payout-sweeper.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/payout-sweeper.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-057`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `payout-sweeper.test.ts: sweeps 3 eligible accounts, skips 2 below threshold, balances trial balance.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-058] Implement Merkle Root Snapshotter for Daily Financial Reconciliation
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/ledger-merkle.ts`

#### Description
Compute daily cryptographic Merkle roots over all account balances and journal entries for external auditor verification. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/ledger-merkle.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Generates inclusion proof for any owner's balance; single micro-unit change alters daily root.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Merkle Root Snapshotter for Daily Financial Reconciliation` in `packages/ledger-engine/src/ledger-merkle.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/ledger-merkle.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-058`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ledger-merkle.test.ts: snapshots 1,000 accounts, verifies inclusion proof, detects 1-micro-unit mutation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-059] Add Escrow & Collateral Hold Sub-Accounts for Wholesale Market Margin
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/collateral-escrow.ts`

#### Description
Lock collateral funds before submitting wholesale bids and release or forfeit collateral based on verified dispatch compliance. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/collateral-escrow.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Insufficient collateral blocks bid submission; full delivery releases 100% of hold.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Escrow & Collateral Hold Sub-Accounts for Wholesale Market Margin` in `packages/ledger-engine/src/collateral-escrow.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/collateral-escrow.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-059`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `collateral-escrow.test.ts: places hold, verifies spendable balance reduced, releases hold post-settlement.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-060] Build High-Volume 1M-Line Settlement Stress & Invariant Benchmark
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `packages/ledger-engine/src/ledger-benchmark.ts`

#### Description
Create a standalone offline benchmark posting 1,000,000 ledger lines across 10,000 accounts and running full LedgerInvariantAuditor verification. Implement this module in strict TypeScript inside `packages/ledger-engine` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `packages/ledger-engine/src/ledger-benchmark.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero micro-unit discrepancy across 1M lines; completes audit in <2 seconds.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `packages/ledger-engine/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build High-Volume 1M-Line Settlement Stress & Invariant Benchmark` in `packages/ledger-engine/src/ledger-benchmark.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `packages/ledger-engine/src/ledger-benchmark.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `packages/ledger-engine/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-060`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ledger-benchmark.test.ts: runs 100k-line CI variant and asserts zero violations and throughput SLA.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 7: Edge Fleet Simulator & High-Throughput Telemetry Ingestor

### [MRD-061] Implement Worker-Thread Sharded Fleet Simulator (10k+ Virtual Devices)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/edge-fleet-simulator/src/worker-fleet.ts`

#### Description
Partition 10,000+ simulated batteries across Node.js `worker_threads` for parallel physics ticking and command handling. Implement this module in strict TypeScript inside `apps/edge-fleet-simulator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/edge-fleet-simulator/src/worker-fleet.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Sustains 10,000 devices ticking every 500ms with <300MB RAM and balanced CPU utilization.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/edge-fleet-simulator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Worker-Thread Sharded Fleet Simulator (10k+ Virtual Devices)` in `apps/edge-fleet-simulator/src/worker-fleet.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/edge-fleet-simulator/src/worker-fleet.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/edge-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-061`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `worker-fleet.test.ts: spawns 4 workers with 2,500 devices each, verifies synchronized tick aggregation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-062] Add Realistic Diurnal Load, Solar & EV Plug-In Scenario Profiles
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/edge-fleet-simulator/src/scenario-profiles.ts`

#### Description
Simulate morning/evening residential demand peaks, solar midday curves, and stochastic EV arrival/departure patterns offline. Implement this module in strict TypeScript inside `apps/edge-fleet-simulator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/edge-fleet-simulator/src/scenario-profiles.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Fleet aggregate SoC follows realistic 24-hour curve; supports deterministic replay via SimClock.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/edge-fleet-simulator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Realistic Diurnal Load, Solar & EV Plug-In Scenario Profiles` in `apps/edge-fleet-simulator/src/scenario-profiles.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/edge-fleet-simulator/src/scenario-profiles.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/edge-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-062`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `scenario-profiles.test.ts: runs 24h accelerated simulation, verifies midday solar peak and evening discharge.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-063] Build Adversarial Fault-Injection Engine (Spoofing, Replay, Partition, Drift)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/edge-fleet-simulator/src/fault-injector.ts`

#### Description
Inject targeted attacks: coordinated Sybil spoofing, clock-drift frames, replayed commands, and regional network blackouts. Implement this module in strict TypeScript inside `apps/edge-fleet-simulator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/edge-fleet-simulator/src/fault-injector.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Fault scenarios activate/deactivate on schedule without restarting the simulator.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/edge-fleet-simulator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Adversarial Fault-Injection Engine (Spoofing, Replay, Partition, Drift)` in `apps/edge-fleet-simulator/src/fault-injector.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/edge-fleet-simulator/src/fault-injector.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/edge-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-063`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `fault-injector.test.ts: injects 5% spoofers + 10% packet drop, verifies exact fault rates observed.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-064] Implement Local TCP/NDJSON Framed Edge Transport Protocol
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/edge-transport.ts`

#### Description
Add an optional real local loopback TCP (`node:net`) framed binary/JSON transport between fleet simulator and telemetry ingestor. Implement this module in strict TypeScript inside `apps/edge-fleet-simulator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/edge-transport.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Handles TCP packet fragmentation, reconnects, and backpressure cleanly on 127.0.0.1.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/edge-fleet-simulator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Local TCP/NDJSON Framed Edge Transport Protocol` in `apps/telemetry-ingestor/src/edge-transport.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/edge-transport.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/edge-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-064`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `edge-transport.test.ts: streams 20,000 frames over loopback TCP with fragmented chunks and zero frame loss.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-065] Build Adaptive Ring-Buffer Batcher with Latency & Size Triggers
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/ring-batcher.ts`

#### Description
Upgrade TelemetryIngestor to use a fixed-capacity ring buffer flushing on either maxBatchSize or maxWaitMs (whichever fires first). Implement this module in strict TypeScript inside `apps/edge-fleet-simulator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/ring-batcher.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Low traffic flushes within maxWaitMs; burst traffic flushes at maxBatchSize; graceful shutdown drains 100%.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/edge-fleet-simulator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Adaptive Ring-Buffer Batcher with Latency & Size Triggers` in `apps/telemetry-ingestor/src/ring-batcher.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/ring-batcher.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/edge-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-065`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ring-batcher.test.ts: tests timer-triggered flush, size-triggered flush, and SIGTERM drain.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-066] Add Per-Device Token-Bucket Ingestion Rate Limiter
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/device-rate-limiter.ts`

#### Description
Protect ingestor from compromised/buggy inverters flooding telemetry at 1000 Hz using per-device token buckets. Implement this module in strict TypeScript inside `apps/edge-fleet-simulator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/device-rate-limiter.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Drops excess frames above burst cap while keeping compliant devices unaffected; emits throttle metrics.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/edge-fleet-simulator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Per-Device Token-Bucket Ingestion Rate Limiter` in `apps/telemetry-ingestor/src/device-rate-limiter.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/device-rate-limiter.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/edge-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-066`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `device-rate-limiter.test.ts: flooding device gets throttled while neighbor devices pass 100%.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-067] Implement Sequence-Number Gap & Duplicate Telemetry Deduplicator
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/seq-dedup.ts`

#### Description
Track last-seen sequenceNumber per device to drop duplicate retransmissions and log missing packet gaps. Implement this module in strict TypeScript inside `apps/edge-fleet-simulator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/seq-dedup.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Duplicate sequence frames are dropped before TSDB write; gap counter increments accurately.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/edge-fleet-simulator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Sequence-Number Gap & Duplicate Telemetry Deduplicator` in `apps/telemetry-ingestor/src/seq-dedup.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/seq-dedup.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/edge-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-067`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `seq-dedup.test.ts: sends seq 1,2,2,5 -> accepts 1,2,5, counts 1 dup and 2 missing.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-068] Build Schema-Versioned Telemetry Migrator (v1 -> v2 Upcaster)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/upcaster.ts`

#### Description
Support legacy v1 inverter firmware payloads alongside v2 payloads via deterministic upcasting before validation. Implement this module in strict TypeScript inside `apps/edge-fleet-simulator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/upcaster.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Legacy payloads seamlessly normalize into canonical InverterTelemetry without dropping frames.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/edge-fleet-simulator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Schema-Versioned Telemetry Migrator (v1 -> v2 Upcaster)` in `apps/telemetry-ingestor/src/upcaster.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/upcaster.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/edge-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-068`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `upcaster.test.ts: ingests mixed v1/v2 batch, verifies canonical v2 output for all frames.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-069] Implement Ingestion Dead-Letter Quarantine Store for Malformed Frames
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/malformed-store.ts`

#### Description
Capture rejected/corrupted telemetry frames with diagnostic reason codes in a bounded local ring log for operator inspection. Implement this module in strict TypeScript inside `apps/edge-fleet-simulator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/malformed-store.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Malformed frames never crash ingestor and are queryable by deviceId and error code.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/edge-fleet-simulator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Ingestion Dead-Letter Quarantine Store for Malformed Frames` in `apps/telemetry-ingestor/src/malformed-store.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/malformed-store.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/edge-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-069`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `malformed-store.test.ts: feeds NaN voltage & negative SoC, verifies structured capture in quarantine store.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-070] Add Ingestion Throughput & p99 Latency Benchmark Harness
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/telemetry-ingestor/src/ingest-bench.ts`

#### Description
Measure sustained frames/sec and p50/p95/p99 batch commit latency locally against TimeSeriesEngine + WAL Broker. Implement this module in strict TypeScript inside `apps/edge-fleet-simulator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/telemetry-ingestor/src/ingest-bench.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reports exact throughput and p99 latency; fails assertion if p99 exceeds 50ms.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/edge-fleet-simulator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Ingestion Throughput & p99 Latency Benchmark Harness` in `apps/telemetry-ingestor/src/ingest-bench.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/telemetry-ingestor/src/ingest-bench.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/edge-fleet-simulator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-070`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `ingest-bench.test.ts: pushes 50,000 frames in bursts and validates SLA report generation.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 8: Stream Anomaly Detection & Anti-Spoofing Intelligence

### [MRD-071] Implement Postal-Sector Neighbor-Median Solar Divergence Detector
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/anomaly-detector/src/neighbor-detector.ts`

#### Description
Cross-reference each inverter's reported solar generation against the median of neighboring inverters in the same postal sector. Implement this module in strict TypeScript inside `apps/anomaly-detector` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/anomaly-detector/src/neighbor-detector.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Flags devices reporting >2.5x sector median during overcast conditions while ignoring uniform cloud transients.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/anomaly-detector/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Postal-Sector Neighbor-Median Solar Divergence Detector` in `apps/anomaly-detector/src/neighbor-detector.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/anomaly-detector/src/neighbor-detector.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/anomaly-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-071`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `neighbor-detector.test.ts: flags 1 spoofing house in a 20-house sector; 0 false positives during cloud cover.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-072] Build Online Welford Mean/Variance Z-Score Anomaly Scorer
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/anomaly-detector/src/welford-scorer.ts`

#### Description
Maintain O(1)-memory streaming mean and variance per device for temperature, voltage, and power residuals. Implement this module in strict TypeScript inside `apps/anomaly-detector` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/anomaly-detector/src/welford-scorer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Computes numerically stable z-scores without storing raw history; flags >4 sigma excursions.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/anomaly-detector/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Online Welford Mean/Variance Z-Score Anomaly Scorer` in `apps/anomaly-detector/src/welford-scorer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/anomaly-detector/src/welford-scorer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/anomaly-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-072`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `welford-scorer.test.ts: verifies Welford variance against batch variance within 1e-9; detects injected spike.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-073] Implement Energy-Conservation Cross-Check (SoC Delta vs Power Integral)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/anomaly-detector/src/conservation-check.ts`

#### Description
Detect spoofed discharge by comparing reported activePowerW integral against actual reported drop in battery SoC %. Implement this module in strict TypeScript inside `apps/anomaly-detector` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/anomaly-detector/src/conservation-check.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Catches attackers claiming 5kW discharge while SoC remains flat within 10 seconds.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/anomaly-detector/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Energy-Conservation Cross-Check (SoC Delta vs Power Integral)` in `apps/anomaly-detector/src/conservation-check.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/anomaly-detector/src/conservation-check.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/anomaly-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-073`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `conservation-check.test.ts: honest discharge passes; flat-SoC high-power spoof triggers CRITICAL alert.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-074] Add Hysteresis & Cooldown State Machine for Quarantine Recovery
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/anomaly-detector/src/quarantine-fsm.ts`

#### Description
Prevent flapping between HEALTHY and QUARANTINED by requiring N consecutive clean windows or operator clearance to rehabilitate a device. Implement this module in strict TypeScript inside `apps/anomaly-detector` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/anomaly-detector/src/quarantine-fsm.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Transitions HEALTHY -> SUSPECT -> QUARANTINED -> PROBATION -> HEALTHY deterministically.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/anomaly-detector/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Hysteresis & Cooldown State Machine for Quarantine Recovery` in `apps/anomaly-detector/src/quarantine-fsm.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/anomaly-detector/src/quarantine-fsm.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/anomaly-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-074`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `quarantine-fsm.test.ts: verifies single blip stays SUSPECT, sustained spoof quarantines, clean probation recovers.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-075] Build Coordinated Botnet / Sybil Cluster Spoofing Detector
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/anomaly-detector/src/sybil-detector.ts`

#### Description
Detect when >5% of devices in a region simultaneously report identical synthetic power curves (low cross-device entropy). Implement this module in strict TypeScript inside `apps/anomaly-detector` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/anomaly-detector/src/sybil-detector.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Flags correlated spoofing attacks even when individual devices stay below inverter max rating.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/anomaly-detector/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Coordinated Botnet / Sybil Cluster Spoofing Detector` in `apps/anomaly-detector/src/sybil-detector.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/anomaly-detector/src/sybil-detector.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/anomaly-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-075`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `sybil-detector.test.ts: injects 30 devices with identical synthetic waveform; detector flags cluster alert.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-076] Implement Thermal Runaway & Grid-Voltage Fault Early Warning Rules
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/anomaly-detector/src/hardware-safety.ts`

#### Description
Detect rapid battery temperature rise (>2C/min) or grid over/under-voltage (>253V / <207V) and emit emergency shutdown alerts. Implement this module in strict TypeScript inside `apps/anomaly-detector` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/anomaly-detector/src/hardware-safety.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Emits CRITICAL hardware safety alert and triggers immediate IDLE command dispatch.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/anomaly-detector/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Thermal Runaway & Grid-Voltage Fault Early Warning Rules` in `apps/anomaly-detector/src/hardware-safety.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/anomaly-detector/src/hardware-safety.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/anomaly-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-076`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `hardware-safety.test.ts: simulates thermal ramp 35C->48C in 4 minutes, verifies emergency alert.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-077] Add Configurable Rule Engine & Hot-Reloadable Threshold Policies
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/anomaly-detector/src/rule-engine.ts`

#### Description
Decouple anomaly detection rules into composable pluggable Rule evaluators with per-region threshold overrides. Implement this module in strict TypeScript inside `apps/anomaly-detector` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/anomaly-detector/src/rule-engine.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Adding or disabling a rule dynamically takes effect on the next telemetry frame without restart.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/anomaly-detector/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Configurable Rule Engine & Hot-Reloadable Threshold Policies` in `apps/anomaly-detector/src/rule-engine.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/anomaly-detector/src/rule-engine.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/anomaly-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-077`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `rule-engine.test.ts: hot-swaps threshold config and confirms updated detection sensitivity.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-078] Build Anomaly Evidence Bundle Recorder for Settlement Disputes
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/anomaly-detector/src/evidence-recorder.ts`

#### Description
Snapshot the 20 telemetry frames leading up to any CRITICAL quarantine alert so asset owners can audit why payout was withheld. Implement this module in strict TypeScript inside `apps/anomaly-detector` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/anomaly-detector/src/evidence-recorder.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Retrieves complete pre-alert window and rule diagnostics by alertId.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/anomaly-detector/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Anomaly Evidence Bundle Recorder for Settlement Disputes` in `apps/anomaly-detector/src/evidence-recorder.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/anomaly-detector/src/evidence-recorder.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/anomaly-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-078`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `evidence-recorder.test.ts: triggers alert, asserts 20-frame evidence bundle persisted and retrievable.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-079] Implement Precision/Recall Evaluation Harness Against Labeled Fault Streams
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/anomaly-detector/src/eval-harness.ts`

#### Description
Run offline confusion-matrix scoring (TP, FP, TN, FN, Precision, Recall, F1) against synthetic fault-injected fleet runs. Implement this module in strict TypeScript inside `apps/anomaly-detector` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/anomaly-detector/src/eval-harness.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Achieves Recall >= 0.98 and False Positive Rate < 0.005 on standard benchmark suite.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/anomaly-detector/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Precision/Recall Evaluation Harness Against Labeled Fault Streams` in `apps/anomaly-detector/src/eval-harness.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/anomaly-detector/src/eval-harness.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/anomaly-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-079`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `eval-harness.test.ts: executes labeled 5,000-frame benchmark and asserts F1 >= 0.98.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-080] Add Anomaly Summary Aggregator for Control Plane Health Dashboards
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/anomaly-detector/src/anomaly-metrics.ts`

#### Description
Aggregate real-time alert counts by rule, region, and severity with rolling 5m/1h windows. Implement this module in strict TypeScript inside `apps/anomaly-detector` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/anomaly-detector/src/anomaly-metrics.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Exposes O(1) snapshot for `/v1/anomalies/summary` endpoint.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/anomaly-detector/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Anomaly Summary Aggregator for Control Plane Health Dashboards` in `apps/anomaly-detector/src/anomaly-metrics.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/anomaly-detector/src/anomaly-metrics.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/anomaly-detector/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-080`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `anomaly-metrics.test.ts: emits mixed alerts across 4 regions, verifies accurate windowed rollups.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 9: Grid Orchestration, Market Bidding & Saga Resilience

### [MRD-081] Implement Multi-Objective Cohort Optimizer (SoC, Wear, Feeder Headroom)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/grid-orchestrator/src/cohort-optimizer.ts`

#### Description
Replace greedy SoC sorting with a weighted scoring function balancing SoC headroom, low cycle wear, thermal margin, and feeder limits. Implement this module in strict TypeScript inside `apps/grid-orchestrator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/grid-orchestrator/src/cohort-optimizer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Never exceeds feeder transformer cap; prefers cooler, higher-SoC, lower-wear batteries.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/grid-orchestrator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Multi-Objective Cohort Optimizer (SoC, Wear, Feeder Headroom)` in `apps/grid-orchestrator/src/cohort-optimizer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/grid-orchestrator/src/cohort-optimizer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/grid-orchestrator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-081`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `cohort-optimizer.test.ts: selects optimal subset respecting feeder cap even when hotter batteries have higher SoC.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-082] Build Real-Time CommandAck Tracker & Automatic Standby Backfill Engine
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/grid-orchestrator/src/standby-backfill.ts`

#### Description
Monitor CommandAck responses within 500ms of dispatch; if >2% of cohort fails to ACK, automatically lock and dispatch standby batteries. Implement this module in strict TypeScript inside `apps/grid-orchestrator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/grid-orchestrator/src/standby-backfill.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Restores delivered MW to >=99% of bid target within 1 second of node dropouts.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/grid-orchestrator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Real-Time CommandAck Tracker & Automatic Standby Backfill Engine` in `apps/grid-orchestrator/src/standby-backfill.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/grid-orchestrator/src/standby-backfill.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/grid-orchestrator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-082`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `standby-backfill.test.ts: drops 10% of primary cohort ACKs, verifies automatic standby recruitment.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-083] Implement Continuous Compliance Monitor & Dynamic Power Rebalancing
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/grid-orchestrator/src/compliance-monitor.ts`

#### Description
Track live aggregate MW delivered every 2s during active dispatches and dynamically ramp up healthy cohort members if others hit reserve floor. Implement this module in strict TypeScript inside `apps/grid-orchestrator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/grid-orchestrator/src/compliance-monitor.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Maintains grid delivery within +/-2% of contracted MW throughout the 15-minute window.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/grid-orchestrator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Continuous Compliance Monitor & Dynamic Power Rebalancing` in `apps/grid-orchestrator/src/compliance-monitor.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/grid-orchestrator/src/compliance-monitor.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/grid-orchestrator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-083`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `compliance-monitor.test.ts: forces 5 batteries to hit minReserveSoc mid-dispatch; remaining fleet ramps up to compensate.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-084] Build Sub-Second Proportional Frequency-Watt Droop Controller
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/grid-orchestrator/src/droop-controller.ts`

#### Description
Compute proportional MW response curves for grid frequency deviations (e.g., linear ramp from 49.95 Hz deadband to 100% power at 49.50 Hz). Implement this module in strict TypeScript inside `apps/grid-orchestrator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/grid-orchestrator/src/droop-controller.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Deadband [49.95, 50.05] Hz outputs 0W; below 49.50 Hz clamps to 100% available power.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/grid-orchestrator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Sub-Second Proportional Frequency-Watt Droop Controller` in `apps/grid-orchestrator/src/droop-controller.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/grid-orchestrator/src/droop-controller.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/grid-orchestrator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-084`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `droop-controller.test.ts: tests deadband, 50% droop at 49.725 Hz, and saturation clamp at 49.40 Hz.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-085] Implement Continuous Limit Order Book (CLOB) Wholesale Energy Exchange
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/market-bidding-engine/src/clob-exchange.ts`

#### Description
Upgrade OfflineEnergyMarket to a full price-time priority Limit Order Book supporting partial fills, cancel/replace, and clearing price discovery. Implement this module in strict TypeScript inside `apps/grid-orchestrator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/market-bidding-engine/src/clob-exchange.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Matches bids/asks strictly by price-time priority; supports partial fills and emits trade execution receipts.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/grid-orchestrator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Continuous Limit Order Book (CLOB) Wholesale Energy Exchange` in `apps/market-bidding-engine/src/clob-exchange.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/market-bidding-engine/src/clob-exchange.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/grid-orchestrator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-085`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `clob-exchange.test.ts: matches crossing orders, handles partial fills, cancels resting orders accurately.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-086] Build Profit-Margin & Degradation-Aware Algorithmic Bidding Strategy
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/market-bidding-engine/src/bidding-strategy.ts`

#### Description
Compute optimal ask price and MW volume by comparing wholesale price forecasts against fleet marginal degradation cost and opportunity cost. Implement this module in strict TypeScript inside `apps/grid-orchestrator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/market-bidding-engine/src/bidding-strategy.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Refuses to bid when clearing price < marginal degradation + platform margin; scales volume with spread.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/grid-orchestrator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Profit-Margin & Degradation-Aware Algorithmic Bidding Strategy` in `apps/market-bidding-engine/src/bidding-strategy.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/market-bidding-engine/src/bidding-strategy.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/grid-orchestrator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-086`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `bidding-strategy.test.ts: skips unprofitable £0.04/kWh tick, bids aggressively on £0.40/kWh spike.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-087] Implement Persistent Disk-Backed Saga State Machine & Crash Recovery Worker
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/market-bidding-engine/src/saga-recovery.ts`

#### Description
Persist every Saga state transition to disk and implement a startup recovery scanner that resumes or compensates interrupted in-flight sagas. Implement this module in strict TypeScript inside `apps/grid-orchestrator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/market-bidding-engine/src/saga-recovery.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Simulated crash after CAPACITY_LOCKED automatically releases orphaned locks on restart.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/grid-orchestrator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Persistent Disk-Backed Saga State Machine & Crash Recovery Worker` in `apps/market-bidding-engine/src/saga-recovery.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/market-bidding-engine/src/saga-recovery.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/grid-orchestrator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-087`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `saga-recovery.test.ts: kills coordinator mid-saga, reloads from disk, verifies zero leaked leases.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-088] Add Multi-Market Arbitrage Router (Frequency Response vs Day-Ahead Peak)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/market-bidding-engine/src/market-router.ts`

#### Description
Allocate regional VPP capacity dynamically across simultaneous Frequency Containment (FCR) and Peak Shaving markets by expected risk-adjusted yield. Implement this module in strict TypeScript inside `apps/grid-orchestrator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/market-bidding-engine/src/market-router.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Splits capacity optimally without double-committing any single battery across markets.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/grid-orchestrator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Multi-Market Arbitrage Router (Frequency Response vs Day-Ahead Peak)` in `apps/market-bidding-engine/src/market-router.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/market-bidding-engine/src/market-router.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/grid-orchestrator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-088`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `market-router.test.ts: allocates 60% to higher-yield FCR and 40% to peak market with disjoint cohorts.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-089] Implement Dispatch Window Lifecycle Scheduler & Auto-Closure Emitter
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/grid-orchestrator/src/window-scheduler.ts`

#### Description
Automatically track active dispatch end timestamps, issue final IDLE commands, release leases, and emit `dispatch.window.closed` events. Implement this module in strict TypeScript inside `apps/grid-orchestrator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/grid-orchestrator/src/window-scheduler.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Every started dispatch cleanly closes, releases locks, and triggers settlement exactly once.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/grid-orchestrator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Dispatch Window Lifecycle Scheduler & Auto-Closure Emitter` in `apps/grid-orchestrator/src/window-scheduler.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/grid-orchestrator/src/window-scheduler.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/grid-orchestrator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-089`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `window-scheduler.test.ts: advances SimClock 15 minutes, verifies IDLE fan-out, lock release, and settlement trigger.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-090] Build Deterministic Market & Grid Disturbance Scenario Replay Engine
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/market-bidding-engine/src/scenario-replayer.ts`

#### Description
Load offline JSON disturbance scripts (e.g., '2019-UK-Blackout-Freq-Drop', 'Winter-Dunkelflaute-Spike') and replay them against Meridian. Implement this module in strict TypeScript inside `apps/grid-orchestrator` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/market-bidding-engine/src/scenario-replayer.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Replays multi-hour synthetic grid crises deterministically in seconds of wall-clock time.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/grid-orchestrator/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Deterministic Market & Grid Disturbance Scenario Replay Engine` in `apps/market-bidding-engine/src/scenario-replayer.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/market-bidding-engine/src/scenario-replayer.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/grid-orchestrator/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-090`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `scenario-replayer.test.ts: replays 3-event crisis script and verifies all 3 sagas clear and settle.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

## Epic 10: Control Plane API, Observability, Chaos & Packaging

### [MRD-091] Implement Full REST Router with Path Params, Query Parsing & Middleware Pipeline
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/router.ts`

#### Description
Build a zero-dependency typed HTTP router supporting path params (`/v1/dispatches/:id`), composable middleware (auth, logging, CORS, rate-limit), and body size limits. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/router.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Rejects payloads >1MB with 413; parses params safely; executes middleware in exact registration order.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Full REST Router with Path Params, Query Parsing & Middleware Pipeline` in `apps/control-plane-api/src/router.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/router.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-091`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `router.test.ts: tests param extraction, 404/405 handling, payload size limit, and middleware short-circuiting.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-092] Add Fleet Asset Registration, Decommissioning & Profile Update Endpoints
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/routes/assets.ts`

#### Description
Expose CRUD endpoints (`POST /v1/assets`, `GET /v1/assets/:id`, `PATCH /v1/assets/:id/reserve`, `DELETE /v1/assets/:id`) with strict validation. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/routes/assets.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Reserve floor updates immediately propagate to GridOrchestrator capacity calculations.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Add Fleet Asset Registration, Decommissioning & Profile Update Endpoints` in `apps/control-plane-api/src/routes/assets.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/routes/assets.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-092`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `assets-route.test.ts: registers new battery, updates minReserveSocPct, verifies capacity snapshot changes.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-093] Build Live Server-Sent Events (SSE) Telemetry & Grid Frequency Stream Endpoint
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/routes/sse-stream.ts`

#### Description
Stream real-time regional capacity, active sagas, and anomaly alerts over native HTTP SSE (`text/event-stream`) with client disconnect cleanup. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/routes/sse-stream.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Streams structured events with heartbeat pings; cleans up broker subscriptions immediately on socket close.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Live Server-Sent Events (SSE) Telemetry & Grid Frequency Stream Endpoint` in `apps/control-plane-api/src/routes/sse-stream.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/routes/sse-stream.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-093`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `sse-stream.test.ts: connects HTTP client, triggers frequency drop, receives SSE event, closes cleanly.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-094] Implement Prometheus Text-Exposition Format `/metrics` Endpoint
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/metrics-exporter.ts`

#### Description
Collect and format Counters, Gauges, and Histograms (event loop lag, ingest rate, fan-out latency, ledger invariant status) in standard Prometheus text format. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/metrics-exporter.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Output parses cleanly under Prometheus exposition grammar with valid HELP/TYPE lines and labels.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Prometheus Text-Exposition Format `/metrics` Endpoint` in `apps/control-plane-api/src/metrics-exporter.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/metrics-exporter.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-094`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `metrics-exporter.test.ts: scrapes `/metrics`, asserts presence of `meridian_ledger_invariant_status 1`.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-095] Build OpenAPI 3.1 Specification Generator from Typed Route Definitions
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/openapi-gen.ts`

#### Description
Auto-generate a valid OpenAPI 3.1 JSON document served at `GET /v1/openapi.json` directly from Meridian's route/validator registry. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/openapi-gen.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Generated JSON includes all routes, request/response schemas, and RFC 7807 error models.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build OpenAPI 3.1 Specification Generator from Typed Route Definitions` in `apps/control-plane-api/src/openapi-gen.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/openapi-gen.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-095`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `openapi-gen.test.ts: validates generated OpenAPI doc structure and verifies every registered route is documented.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-096] Implement Operator Manual Dispatch Override & Emergency Kill-Switch API
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/routes/overrides.ts`

#### Description
Allow authenticated grid operators to manually halt all regional dispatches (`POST /v1/grid/halt`) or trigger manual test dispatches with audit logging. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/routes/overrides.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Emergency halt sends signed IDLE commands to all active devices and logs to hash-chained audit log.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Operator Manual Dispatch Override & Emergency Kill-Switch API` in `apps/control-plane-api/src/routes/overrides.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/routes/overrides.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-096`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `overrides-route.test.ts: triggers halt mid-dispatch, verifies all batteries return to IDLE and audit entry created.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-097] Build Structured JSON Logger with Trace Correlation & Log-Level Filtering
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/logger.ts`

#### Description
Create a zero-dependency high-speed structured JSON logger supporting levels, redaction of secrets/tokens, and automatic traceId injection. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/logger.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Redacts Authorization headers and private keys automatically; outputs valid single-line JSON.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Structured JSON Logger with Trace Correlation & Log-Level Filtering` in `apps/control-plane-api/src/logger.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/logger.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-097`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `logger.test.ts: logs object with secret field, asserts `[REDACTED]` output and valid JSON parse.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-098] Implement End-to-End Chaos Testing Harness (Mid-Saga Kill, Broker Delay, Spoof Storm)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `tests/chaos-suite.ts`

#### Description
Create an automated chaos test runner simulating node crashes, 20% spoofed inverters, and duplicate settlement replays. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `tests/chaos-suite.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Ledger invariant audit passes with 0 drift and 0 quarantined payouts across all chaos scenarios.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement End-to-End Chaos Testing Harness (Mid-Saga Kill, Broker Delay, Spoof Storm)` in `tests/chaos-suite.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `tests/chaos-suite.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-098`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `chaos-suite.test.ts: executes all 5 chaos scenarios offline and asserts 100% invariant pass rate.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-099] Build Interactive Offline CLI Operator Console (`meridian-cli`)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/cli.ts`

#### Description
Provide a zero-dependency Node `readline` CLI to inspect regional MW, fire synthetic frequency drops, inspect DLQ, and run ledger audits live. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/cli.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Supports commands: `capacity`, `drop <region> <hz>`, `audit`, `anomalies`, `sagas`, `quit`.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Interactive Offline CLI Operator Console (`meridian-cli`)` in `apps/control-plane-api/src/cli.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/cli.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-099`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `cli.test.ts: feeds scripted commands via mocked stdin/stdout streams and asserts formatted output.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-100] Implement Deterministic Performance Regression Gate (50k/s Ingest, <300ms Fan-Out)
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `tests/perf-gate.ts`

#### Description
Build an automated offline benchmark gate measuring ingest throughput, 10k-device command fan-out latency, and settlement speed. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `tests/perf-gate.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Outputs JSON benchmark report and exits non-zero if any core SLA regresses.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Deterministic Performance Regression Gate (50k/s Ingest, <300ms Fan-Out)` in `tests/perf-gate.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `tests/perf-gate.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-100`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `perf-gate.test.ts: runs scaled CI profile verifying fan-out <300ms and ledger audit <2s.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-101] Build Snapshot Backup & Point-in-Time Restore Utility for Offline State
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/backup-restore.ts`

#### Description
Archive WAL segments, TSDB chunks, ledger hash chain, and lease journal into a consistent timestamped tar/directory snapshot with SHA-256 manifest. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/backup-restore.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Restoring snapshot into a fresh runtime reproduces exact balances, offsets, and telemetry history.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Snapshot Backup & Point-in-Time Restore Utility for Offline State` in `apps/control-plane-api/src/backup-restore.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/backup-restore.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-101`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `backup-restore.test.ts: creates snapshot, wipes state, restores, asserts identical ledger audit & capacity.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-102] Implement Graceful Shutdown Coordinator & Signal Orchestration
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/shutdown.ts`

#### Description
Coordinate ordered SIGINT/SIGTERM shutdown: stop HTTP ingress -> drain telemetry ring buffer -> flush Outbox -> close WAL handles. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/shutdown.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Zero lost telemetry frames or uncommitted outbox events during graceful shutdown.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Graceful Shutdown Coordinator & Signal Orchestration` in `apps/control-plane-api/src/shutdown.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/shutdown.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-102`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `shutdown.test.ts: triggers shutdown mid-ingestion, verifies 100% buffer flush before process resolve.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-103] Build Replayable Flight-Recorder Debugger for Production Incident Postmortems
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/flight-recorder.ts`

#### Description
Record a compact deterministic event tape (seed + inputs + clock ticks) so any failed simulation or anomaly can be replayed step-by-step offline. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/flight-recorder.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Replaying a recorded tape reproduces the exact final ledger hash and anomaly alert list.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Build Replayable Flight-Recorder Debugger for Production Incident Postmortems` in `apps/control-plane-api/src/flight-recorder.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/flight-recorder.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-103`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `flight-recorder.test.ts: records 60s run, replays tape in fresh runtime, asserts identical final Merkle root.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-104] Implement Multi-Tenant Utility Isolation & Per-Tenant Quotas
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `apps/control-plane-api/src/tenant-isolation.ts`

#### Description
Partition fleets, ledger clearing accounts, and API rate limits by `tenantId` so multiple regional utilities can share one Meridian cluster safely. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `apps/control-plane-api/src/tenant-isolation.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Tenant A cannot view or dispatch Tenant B's batteries or query Tenant B's ledger statements.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Implement Multi-Tenant Utility Isolation & Per-Tenant Quotas` in `apps/control-plane-api/src/tenant-isolation.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `apps/control-plane-api/src/tenant-isolation.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-104`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `tenant-isolation.test.ts: creates 2 tenants, verifies strict cross-tenant isolation across API and orchestrator.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---

### [MRD-105] Create Complete Offline Release Packaging & Verification Script
- **Estimated Effort (AI Programmer):** 3–4 hours
- **Target Workspace / File:** `scripts/verify-offline-release.ts`

#### Description
Automate full offline verification: clean build (`tsc -b`), zero external runtime dependency audit, E2E + chaos + perf test execution. Implement this module in strict TypeScript inside `apps/control-plane-api` using only Node.js built-in modules and existing `@meridian/*` workspace packages so the entire repository remains 100% offline-runnable with zero external runtime dependencies.

#### Acceptance Criteria
- [ ] Core implementation completed in `scripts/verify-offline-release.ts` and cleanly exported from the package barrel `index.ts`.
- [ ] Functional invariants satisfied: Verifies `package.json` has zero external runtime deps and every workspace compiles cleanly with strict TS.
- [ ] Compiles cleanly under `pnpm run build` (`tsc -b`) with `strict: true`, `noUncheckedIndexedAccess: true`, and zero `any` types.
- [ ] Zero external npm runtime dependencies added; runs 100% offline on Node.js >= 20.

#### Prompts for the AI Programmer
> **Prompt 1 (Design & Interface):** Read `apps/control-plane-api/src/index.ts` and `@meridian/domain-core`. Design the strict TypeScript interfaces, error types, and state invariants for `Create Complete Offline Release Packaging & Verification Script` in `scripts/verify-offline-release.ts`. Ensure zero external dependencies and full BigInt/deterministic safety where applicable.
> **Prompt 2 (Implementation):** Implement `scripts/verify-offline-release.ts` with full edge-case handling, JSDoc comments on public methods, and clean exports. Wire it into `apps/control-plane-api/src/index.ts` and ensure `tsc -b` compiles with zero errors.
> **Prompt 3 (Verification & Tests):** Write a comprehensive `node:test` + `node:assert/strict` test suite covering happy paths, concurrency/boundary conditions, and failure modes for `MRD-105`, then run `pnpm run build && node --test` until 100% green.

#### Tests to Pass
- **Test Suite:** `verify-offline-release.test.ts: runs dependency audit and confirms 0 non-workspace runtime dependencies.`
- **Regression Gate:** Existing `pnpm test` end-to-end suite (`tests/e2e.test.mjs`) continues to pass with zero ledger invariant violations.
- **Typecheck Gate:** `pnpm run build` exits with code `0`.

---
