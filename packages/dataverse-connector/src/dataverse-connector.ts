import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  Provider,
  AuthType,
  ChainId,
} from "./types";
import { IProvider } from "./provider";
import { BaseProvider } from "./provider/base-provider";

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
    params,
  }: {
    method: T;
    params?: RequestType[T];
  }): Promise<Awaited<ReturnType[T]>> {
    return this.provider.runOS({ method, params });
  }

  getDAppTable() {
    return this.provider.getDAppTable();
  }

  getDAppInfo(dappId: string) {
    return this.provider.getDAppInfo(dappId);
  }

  getCurrentPkh(): string {
    return this.provider.getCurrentPkh();
  }

  async createProfile({
    chainId,
    handle,
  }: {
    chainId: ChainId;
    handle: string;
  }): Promise<string> {
    return this.provider.createProfile({ chainId, handle });
  }

  async getProfiles({
    chainId,
    address,
  }: {
    chainId: ChainId;
    address: string;
  }): Promise<{ id: string }[]> {
    return this.provider.getProfiles({ chainId, address });
  }

  async getProfileIdByHandle({
    chainId,
    handle,
  }: {
    chainId: ChainId;
    handle: string;
  }): Promise<string> {
    return this.provider.getProfileIdByHandle({ chainId, handle });
  }

  async getHandleByProfileId({
    chainId,
    profileId,
  }: {
    chainId: ChainId;
    profileId: string;
  }): Promise<string> {
    return this.provider.getHandleByProfileId({ chainId, profileId });
  }

  getTimestampByBlockNumber({
    chainId,
    blockNumber,
  }: {
    chainId: ChainId;
    blockNumber: number;
  }) {
    return this.provider.getTimestampByBlockNumber({ chainId, blockNumber });
  }
}
