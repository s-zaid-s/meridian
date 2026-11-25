import { generateKeyPairSync, sign, verify, randomBytes, type KeyObject } from "node:crypto";
import type { SignedDispatchCommand } from "@meridian/domain-core";

export interface KeyPairBundle {
  readonly publicKey: KeyObject;
  readonly privateKey: KeyObject;
}

/**
 * Ed25519 asymmetric command signer & replay-resistant verifier for edge dispatch commands.
 */
export class DispatchCommandSigner {
  private readonly privateKey: KeyObject;
  private readonly publicKey: KeyObject;
  private readonly seenNonces: Map<string, number> = new Map();
  private readonly maxClockSkewMs: number;

  public constructor(keys?: KeyPairBundle, maxClockSkewMs = 30_000) {
    if (keys) {
      this.privateKey = keys.privateKey;
      this.publicKey = keys.publicKey;
    } else {
      const generated = generateKeyPairSync("ed25519");
      this.privateKey = generated.privateKey;
      this.publicKey = generated.publicKey;
    }
    this.maxClockSkewMs = maxClockSkewMs;
  }

  public getPublicKey(): KeyObject {
    return this.publicKey;
  }

  private static canonicalPayload(cmd: Omit<SignedDispatchCommand, "signatureHex">): Buffer {
    const serialized = [
      cmd.commandId,
      cmd.dispatchId,
      cmd.deviceId,
      cmd.regionId,
      cmd.action,
      cmd.targetPowerW.toString(),
      cmd.durationSec.toString(),
      cmd.issuedAtMs.toString(),
      cmd.expiresAtMs.toString(),
      cmd.fencingToken.toString(),
      cmd.nonce
    ].join("|");
    return Buffer.from(serialized, "utf8");
  }

  public signCommand(
    unsigned: Omit<SignedDispatchCommand, "signatureHex" | "nonce">
  ): SignedDispatchCommand {
    const nonce = randomBytes(12).toString("hex");
    const withNonce = { ...unsigned, nonce };
    const payload = DispatchCommandSigner.canonicalPayload(withNonce);
    const sig = sign(null, payload, this.privateKey);
    return {
      ...withNonce,
      signatureHex: sig.toString("hex")
    };
  }

  public verifyCommand(
    cmd: SignedDispatchCommand,
    nowMs: number = Date.now(),
    enforceReplayProtection = true
  ): { valid: boolean; reason?: string } {
    if (nowMs > cmd.expiresAtMs + this.maxClockSkewMs) {
      return { valid: false, reason: "COMMAND_EXPIRED" };
    }
    if (cmd.issuedAtMs > nowMs + this.maxClockSkewMs) {
      return { valid: false, reason: "COMMAND_FROM_FUTURE" };
    }

    const { signatureHex, ...rest } = cmd;
    const payload = DispatchCommandSigner.canonicalPayload(rest);
    const sigBuf = Buffer.from(signatureHex, "hex");
    const ok = verify(null, payload, this.publicKey, sigBuf);
    if (!ok) {
      return { valid: false, reason: "INVALID_ED25519_SIGNATURE" };
    }

    if (enforceReplayProtection) {
      this.pruneExpiredNonces(nowMs);
      if (this.seenNonces.has(cmd.nonce)) {
        return { valid: false, reason: "REPLAY_NONCE_DETECTED" };
      }
      this.seenNonces.set(cmd.nonce, cmd.expiresAtMs);
    }

    return { valid: true };
  }

  private pruneExpiredNonces(nowMs: number): void {
    if (this.seenNonces.size < 20_000) return;
    for (const [nonce, exp] of this.seenNonces.entries()) {
      if (exp < nowMs) {
        this.seenNonces.delete(nonce);
      }
    }
  }
}
