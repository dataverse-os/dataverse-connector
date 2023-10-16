import {
  ChainId,
  CollectModule,
  CreateDataTokenInput,
} from "@dataverse/dataverse-contracts-sdk/data-token";

import { PublishDataUnionInput } from "@dataverse/dataverse-contracts-sdk/data-union";

export type DatatokenVars = Omit<CreateDataTokenInput, "contentURI"> & {
  chainId: ChainId;
};

export type DataUnionVars = Omit<
  PublishDataUnionInput,
  "createDataTokenInput"
> & {
  datatokenVars: DatatokenVars;
};

export type { CollectModule };

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
