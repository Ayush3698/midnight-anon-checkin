import { describe, it, expect } from "vitest";
import { Contract } from "../managed/checkin/contract/index.js";
import { createCheckInPrivateState, witnesses } from "../witnesses";

// These tests run against the local circuit implementation generated
// by `compact compile`. They exercise the same logic that will run
// on-chain, without needing a live network connection.
//
// Run with: npm test  (after `npm run compact` has generated ./src/managed)

describe("checkin contract", () => {
  it("starts open with zero attendees", () => {
    const contract = new Contract(witnesses);
    const { currentPrivateState, currentContractState } =
      contract.initialState(
        // constructor arg: capacity of 3
        { privateState: createCheckInPrivateState(new Uint8Array(32)) } as any,
      );

    expect(currentContractState.ledger.attendeeCount).toBe(0n);
  });

  it("increments attendeeCount on a valid check-in", () => {
    const contract = new Contract(witnesses);
    const secret = new Uint8Array(32).fill(7);
    const state = createCheckInPrivateState(secret);

    const { currentPrivateState, currentContractState, context } =
      contract.initialState({ privateState: state } as any);

    const result = contract.impureCircuits.checkIn(context);
    expect(result.context.currentContractState.ledger.attendeeCount).toBe(1n);
  });

  it("rejects check-in once the event is closed", () => {
    const contract = new Contract(witnesses);
    const secret = new Uint8Array(32).fill(1);
    const state = createCheckInPrivateState(secret);

    const { context } = contract.initialState({ privateState: state } as any);
    contract.impureCircuits.closeEvent(context);

    expect(() => contract.impureCircuits.checkIn(context)).toThrow();
  });
});
