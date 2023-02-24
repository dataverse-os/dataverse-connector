import { BigNumber, BigNumberish } from "ethers";
import { Currency } from "./constants";

export interface DatatokenVars {
  streamId: string;
  profileId?: BigNumber;
  collectLimit: number;
  amount: number;
  currency: Currency;
}

export interface CreateDatatokenOutPut {
  creator: string;
  hub: string;
  datatokenId: string;
  txHash: string;
}

export interface CollectOutput {
  datatokenId: string;
  collector: string;
  collectNFT: string;
  tokenId: BigNumberish;
  txHash: string;
}

export interface AccessControlCondition {
  contractAddress: string;
  chain: string;
  standardContractType: string;
  method: string;
  parameters: string[];
  returnValueTest: ReturnValueTest;
}

export interface UnifiedAccessControlCondition {
  contractAddress: string;
  conditionType: string;
  functionName: string;
  functionParams: [string, string];
  functionAbi: {
    inputs: { internalType: string; name: string; type: string }[];
    name: string;
    outputs: { internalType: string; name: string; type: string };
  };
  chain: string;
  returnValueTest: {
    key: string;
    comparator: string;
    value: string;
  };
}

export type DecryptionConditions =
  | (AccessControlCondition | BooleanCondition)[]
  | (UnifiedAccessControlCondition | BooleanCondition)[];

export interface BooleanCondition {
  operator: "and" | "or";
}

export interface ReturnValueTest {
  comparator: string;
  value: string;
}

export interface AdditionalMirrorParams {
  folderId: string;
  bucketId: string;
}
