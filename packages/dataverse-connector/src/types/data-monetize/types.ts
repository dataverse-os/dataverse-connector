import { BigNumber, BigNumberish } from "ethers";
import { Currency } from "./constants";

export interface DatatokenVars {
  profileId?: string;
  collectLimit: number;
  amount: number;
  currency: Currency;
}

export type CreateProfileOutput = {
  profileId: BigNumber;
  profileOwner: string;
  txHash: string;
};

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

export interface DatatokenMetadata {
  hub: string;
  profileId: BigNumberish;
  pubId: BigNumberish;
  collectModule: string;
}

export interface AccessControlCondition {
  conditionType?: string;
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
  standardContractType?: string;
  method?: string;
  parameters?: string[];
  functionName: string;
  functionParams: string[];
  functionAbi: {
    inputs: { internalType: string; name: string; type: string }[];
    name: string;
    outputs: { internalType: string; name: string; type: string }[];
  };
  chain: string;
  returnValueTest: {
    key: string;
    comparator: string;
    value: string;
  };
}

export type DecryptionConditions = (
  | AccessControlCondition
  | BooleanCondition
  | (UnifiedAccessControlCondition | BooleanCondition)[]
)[];

export interface BooleanCondition {
  operator: "and" | "or" | string;
}

export interface ReturnValueTest {
  comparator: string;
  value: string;
}

export interface AdditionalMirrorParams {
  folderId: string;
  bucketId: string;
}
