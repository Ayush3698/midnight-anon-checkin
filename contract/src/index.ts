import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

export * from "./managed/checkin/contract/index.js";
export * from "./witnesses";

import * as CompiledCheckInContract from "./managed/checkin/contract/index.js";
import * as Witnesses from "./witnesses";

export const CompiledCheckInContractContract = CompiledContract.make<
  CompiledCheckInContract.Contract<Witnesses.CheckInPrivateState>
>(
  "CheckIn",
  CompiledCheckInContract.Contract<Witnesses.CheckInPrivateState>,
).pipe(
  CompiledContract.withWitnesses(Witnesses.witnesses),
  CompiledContract.withCompiledFileAssets("./managed/checkin"),
);
