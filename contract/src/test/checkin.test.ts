import { describe, it, expect } from "vitest";
import {
  Contract,
  pureCircuits,
  EventState,
  ledger,
} from "../managed/checkin/contract/index.js";
import { createConstructorContext } from "@midnight-ntwrk/compact-runtime";
import { createCheckInPrivateState, witnesses } from "../witnesses";

// Dummy 32-byte coin public key — fine for local, undeployed testing.
// A real deployment gets a real one from the connected wallet.
const dummyCoinPublicKey = { bytes: new Uint8Array(32) };

describe("checkin contract constructor", () => {
  it("initializes with the event open, zero attendees, and the given capacity disclosed", () => {
    const contract = new Contract(witnesses);
    const privateState = createCheckInPrivateState(new Uint8Array(32));
    const constructorContext = createConstructorContext(
      privateState,
      dummyCoinPublicKey,
    );

    const { currentContractState } = contract.initialState(
      constructorContext,
      50n, // capacity
    );

    const decodedLedger = ledger(currentContractState.data);

    expect(decodedLedger.eventState).toEqual(EventState.OPEN);
    expect(decodedLedger.attendeeCount).toEqual(0n);
    expect(decodedLedger.capacity).toEqual(50n);
  });
});

describe("attendeeCommitment (the privacy mechanism)", () => {
  it("is deterministic: same code + slot always produces the same commitment", () => {
    const code = new Uint8Array(32).fill(7);
    const slot = new Uint8Array(32).fill(0);

    const commitment1 = pureCircuits.attendeeCommitment(code, slot);
    const commitment2 = pureCircuits.attendeeCommitment(code, slot);

    expect(commitment1).toEqual(commitment2);
  });

  it("produces unlinkable commitments: the same code at a different slot gives a different hash", () => {
    const code = new Uint8Array(32).fill(7);
    const slotA = new Uint8Array(32).fill(0);
    const slotB = new Uint8Array(32).fill(1);

    const commitmentA = pureCircuits.attendeeCommitment(code, slotA);
    const commitmentB = pureCircuits.attendeeCommitment(code, slotB);

    expect(commitmentA).not.toEqual(commitmentB);
  });

  it("produces different commitments for different codes at the same slot", () => {
    const codeA = new Uint8Array(32).fill(1);
    const codeB = new Uint8Array(32).fill(2);
    const slot = new Uint8Array(32).fill(0);

    const commitmentA = pureCircuits.attendeeCommitment(codeA, slot);
    const commitmentB = pureCircuits.attendeeCommitment(codeB, slot);

    expect(commitmentA).not.toEqual(commitmentB);
  });
});
