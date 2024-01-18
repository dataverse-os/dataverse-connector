import { getDapp, getDapps } from "@dataverse/dapp-table-client";

import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  Provider,
  AuthType
} from "./types";
import { IProvider } from "./provider";
import { BaseProvider } from "./provider/base-provider";
import { Model } from "./types/app/types";
import { Dapp } from "@dataverse/dapp-table-client/dist/esm/__generated__/types";

export class DataverseConnector {
  provider: BaseProvider;

  constructor(provider: BaseProvider) {
    this.provider = provider;
  }

  get isConnected() {
    return this.provider.isConnected;
  }

  get wallet() {
    return this.provider.wallet;
  }

  get address() {
    return this.provider.address;
  }

  get chain() {
    return this.provider.chain;
  }

  get appId() {
    return this.provider.appId;
  }

  get userInfo() {
    return this.provider.userInfo;
  }

  getProvider(): IProvider {
    return this.provider;
  }

  async connectWallet(params?: {
    wallet?: WALLET | undefined;
    preferredAuthType?: AuthType;
    provider?: Provider;
  }): Promise<{
    address: string;
    chain: Chain;
    wallet: WALLET;
    userInfo?: any;
  }> {
    return this.provider.connectWallet(params);
  }

  async getCurrentWallet(): Promise<
    | {
        address: string;
        chain: Chain;
        wallet: WALLET;
      }
    | undefined
  > {
    return this.provider.getCurrentWallet();
  }

  async runOS<T extends SYSTEM_CALL>({
    method,
    params
  }: {
    method: T;
    params?: RequestType[T];
  }): Promise<Awaited<ReturnType[T]>> {
    return this.provider.runOS({ method, params });
  }

  getDAppTable() {
    return getDapps();
  }

  getDAppInfo(dappId: string) {
    return getDapp(dappId);
  }

  getLatestStream(model: Model) {
    return model.streams.find((stream) => stream.latest);
  }

  getModelIdByAppIdAndModelName({
    dapp,
    modelName
  }: {
    dapp: Dapp;
    modelName: string;
  }): string | undefined {
    const model = dapp.models.find((model) => model.modelName === modelName);
    if (model) {
      return this.getLatestStream(model).modelId;
    }
    return undefined;
  }
}
