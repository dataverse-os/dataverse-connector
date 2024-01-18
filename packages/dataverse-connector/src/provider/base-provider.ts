/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  Provider,
  AuthType,
} from "../types";
import { EthersProvider, IProvider } from "./types";

export abstract class BaseProvider implements IProvider {
  _provider?: EthersProvider;
  isConnected?: boolean;
  wallet?: WALLET;
  address?: string;
  chain?: Chain;
  appId?: string;
  userInfo?: any;

  constructor() {}

  on(event: string, listener: Function): this {
    if (!this._provider) {
      throw new Error("Please connect wallet first");
    }
    return this._provider.on(event, listener), this;
  }
  off(event: string, listener?: Function): this {
    if (!this._provider) {
      throw new Error("Please connect wallet first");
    }
    return this._provider.off(event, listener), this;
  }
  request({
    method,
    params,
  }: {
    method: string;
    params?: any[];
  }): Promise<any> {
    if (!this._provider) {
      throw new Error("Please connect wallet first");
    }
    return this._provider.request({ method, params });
  }

  getProvider(): EthersProvider {
    return this._provider;
  }

  abstract connectWallet: (params?: {
    wallet?: WALLET | undefined;
    preferredAuthType?: AuthType;
    provider?: Provider;
  }) => Promise<{
    address: string;
    chain: Chain;
    wallet: WALLET;
    userInfo?: any;
  }>;

  abstract getCurrentWallet: () => Promise<
    | {
        address: string;
        chain: Chain;
        wallet: WALLET;
      }
    | undefined
  >;

  abstract runOS: <T extends SYSTEM_CALL>({
    method,
    params,
  }: {
    method: T;
    params?: RequestType[T];
  }) => Promise<Awaited<ReturnType[T]>>;

  getCurrentPkh(): string {
    if (!this.address) {
      throw new Error("Please connect wallet first");
    }
    return `did:pkh:eip155:1:${this.address}`;
  }
}
