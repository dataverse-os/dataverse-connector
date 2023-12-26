import {
  GraphType as DataTokenType,
  CreateDataTokenInput,
  CreateDataTokenOutput,
  CollectDataTokenOutput,
  ChainId,
  DataTokenParams
} from "@dataverse/contracts-sdk/data-token";

import {
  PublishDataUnionInput,
  PublishDataUnionOutput,
  CollectDataUnionOutput as CollectDataUnionResult,
  SubscribeDataUnionInput,
  SubscribeDataUnionOutput as SubscribeDataUnionResult
} from "@dataverse/contracts-sdk/data-union";

export type DatatokenVars<T extends DataTokenType = DataTokenType> = Omit<
  CreateDataTokenInput<T>,
  "contentURI"
> &
  DataTokenParams[T] & {
    chainId: ChainId;
    streamId: string;
  };

export type CreateDatatokenOutput = Omit<CreateDataTokenOutput, "dataToken"> & {
  datatokenId: string;
};

export type CollectDatatokenOutput = Omit<
  CollectDataTokenOutput,
  "dataToken"
> & {
  datatokenId: string;
};

export type DataUnionVars = Omit<
  PublishDataUnionInput,
  "createDataTokenInput"
> & {
  datatokenVars: DatatokenVars<DataTokenType.Profileless>;
};

export type CreateDataUnionOutput = Omit<
  PublishDataUnionOutput,
  "dataToken"
> & {
  datatokenId: string;
};

export type CollectDataUnionOutput = Omit<
  CollectDataUnionResult,
  "dataToken"
> & {
  datatokenId: string;
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
  collectTokenId: string;
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
  functionParams: (string | number)[];
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

export interface MonetizationProvider {
  protocol: DataTokenType;
  chainId: ChainId;
  baseContract?: string;
  unionContract?: string;
  datatokenId?: string;
  dataUnionId?: string;
  dataUnionIds?: string[];
  blockNumber?: number;
  unlockingTimeStamp?: string;
}

export enum EncryptionProtocol {
  Lit = "Lit"
}

export enum DecryptionConditionsTypes {
  AccessControlCondition = "AccessControlCondition",
  UnifiedAccessControlCondition = "UnifiedAccessControlCondition"
}

export interface EncryptionProvider {
  protocol: EncryptionProtocol;
  encryptedSymmetricKey?: string;
  decryptionConditions: DecryptionConditions;
  decryptionConditionsType: DecryptionConditionsTypes;
}

export interface MonetizationProvider {
  protocol: DataTokenType;
  chainId: ChainId;
  baseContract?: string;
  unionContract?: string;
  datatokenId?: string;
  dataUnionId?: string;
  dataUnionIds?: string[];
  blockNumber?: number;
  unlockingTimeStamp?: string;
}

export interface AccessControl {
  encryptionProvider?: EncryptionProvider;
  monetizationProvider?: MonetizationProvider;
}

export type {
  DataTokenGraphType,
  Datatoken_Collector,
  Chain,
  ChainId,
  GraphType as DataTokenType
} from "@dataverse/contracts-sdk/data-token";

export type {
  DataUnionGraphType,
  Data_Union_Subscriber
} from "@dataverse/contracts-sdk/data-union";
