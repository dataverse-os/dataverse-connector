import {
  ChainId,
  CreateDataTokenInput,
  DataTokenParams,
} from "@dataverse/contracts-sdk/data-token";

import {
  PublishDataUnionInput,
  SubscribeDataUnionInput,
  SubscribeDataUnionOutput as SubscribeDataUnionResult,
} from "@dataverse/contracts-sdk/data-union";
import { DatatokenType } from "./constants";

export type DatatokenVars<T extends DatatokenType = DatatokenType> = Omit<
  CreateDataTokenInput<T>,
  "contentURI"
> &
  DataTokenParams[T] & {
    chainId: ChainId;
  };

export type DataUnionVars = Omit<
  PublishDataUnionInput,
  "createDataTokenInput"
> & {
  datatokenVars: DatatokenVars;
};

export type SubscribeDataUnionOutput = Omit<
  SubscribeDataUnionResult,
  "dataUnionId" | "collectTokenId" | "startAt" | "endAt"
> & {
  dataUnionId: string;
  collectTokenId: string;
  subscribeModule: string;
  startAt: number;
  endAt: number;
};

export interface SubscribeDataUnionVars extends SubscribeDataUnionInput {
  dataUnionId: string;
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

export type {
  DataTokenGraphType,
  Datatoken_Collector,
} from "@dataverse/contracts-sdk/data-token";

export type {
  DataUnionGraphType,
  Data_Union_Subscriber,
} from "@dataverse/contracts-sdk/data-union";
