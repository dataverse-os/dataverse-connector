import { Chain, RequestType, ReturnType, SYSTEM_CALL } from "../types";

export interface EthersProvider {
  _provider?: EthersProvider;
  isConnected?: boolean;
  wallet?: string;
  address?: string;
  chain?: Chain;
  userInfo?: any;

  on(event: string, listener: Function): this;
  off(event: string, listener?: Function): this;
  request({
    method,
    params
  }: {
    method: string;
    params?: Array<any>;
  }): Promise<any>;
}

export interface DataverseProvider {
  appId?: string;

  runOS<T extends SYSTEM_CALL>({
    method,
    params
  }: {
    method: T;
    params?: RequestType[T];
  }): Promise<Awaited<ReturnType[T]>>;
}

export type IProvider = EthersProvider & DataverseProvider;
