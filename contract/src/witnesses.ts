import { Ledger } from "./managed/checkin/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

// Private, off-chain state for a single attendee. This never touches
// the public ledger — it lives only on the user's own machine.
export type CheckInPrivateState = {
  readonly secretCode: Uint8Array;
};

export const createCheckInPrivateState = (
  secretCode: Uint8Array,
): CheckInPrivateState => ({
  secretCode,
});

export const witnesses = {
  secretCode: ({
    privateState,
  }: WitnessContext<Ledger, CheckInPrivateState>): [
    CheckInPrivateState,
    Uint8Array,
  ] => [privateState, privateState.secretCode],
};
