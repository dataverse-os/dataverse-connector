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
  dataTokenId: string;
};

export type CollectDatatokenOutput = Omit<
  CollectDataTokenOutput,
  "dataToken"
> & {
  dataTokenId: string;
};

export type DataUnionVars = Omit<
  PublishDataUnionInput,
  "createDataTokenInput"
> & {
  dataTokenVars: DatatokenVars<DataTokenType.Profileless>;
};

export type CreateDataUnionOutput = Omit<
  PublishDataUnionOutput,
  "dataToken"
> & {
  dataTokenId: string;
};

export type CollectDataUnionOutput = Omit<
  CollectDataUnionResult,
  "dataToken"
> & {
  dataTokenId: string;
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

export enum AssetType {
  dataToken,
  dataUnion
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
