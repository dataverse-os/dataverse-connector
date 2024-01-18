/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from "ethers";
import { getDapp, getDapps } from "@dataverse/dapp-table-client";
import {
  createLensProfile,
  getLensProfiles,
  getLensProfileIdByHandle,
  getHandleByLensProfileId,
} from "@dataverse/contracts-sdk/data-token";
import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  Provider,
  AuthType,
  ChainId,
} from "../types";
import { getTimestampByBlockNumber as fetchTimestampByBlockNumber } from "@dataverse/contracts-sdk";
import { LensHandleNamespace } from "../types/constants";
import { EthersProvider } from "./types";

export abstract class BaseProvider implements EthersProvider {
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

  getDAppTable() {
    return getDapps();
  }

  getDAppInfo(dappId: string) {
    return getDapp(dappId);
  }

  getCurrentPkh(): string {
    if (!this.address) {
      throw new Error("Please connect wallet first");
    }
    return `did:pkh:eip155:1:${this.address}`;
  }

  async createProfile({
    chainId,
    handle,
  }: {
    chainId: ChainId;
    handle: string;
  }): Promise<string> {
    if (!this?.isConnected) {
      throw new Error("Please connect wallet first");
    }

    const provider = new ethers.providers.Web3Provider(this._provider, "any");
    const signer = provider.getSigner();

    const id = await getLensProfileIdByHandle({
      chainId,
      handle: `${LensHandleNamespace}/${handle}`,
    });

    if (id && Number.parseInt(id) != 0)
      throw new Error("Handle is taken, try a new handle.");

    const profile = await createLensProfile({
      chainId,
      handle: handle,
      to: await signer.getAddress(),
    });

    return profile;
  }

  async getProfiles({
    chainId,
    address,
  }: {
    chainId: ChainId;
    address: string;
  }): Promise<{ id: string }[]> {
    const res = await getLensProfiles({
      chainId,
      account: address,
    });

    return res.map(item => ({ id: item }));
  }

  async getProfileIdByHandle({
    chainId,
    handle,
  }: {
    chainId: ChainId;
    handle: string;
  }): Promise<string> {
    const res = await getLensProfileIdByHandle({
      chainId,
      handle: `${LensHandleNamespace}/${handle}`,
    });

    return res;
  }

  async getHandleByProfileId({
    chainId,
    profileId,
  }: {
    chainId: ChainId;
    profileId: string;
  }): Promise<string> {
    const res = await getHandleByLensProfileId({
      chainId,
      profileId,
    });

    return res;
  }

  getTimestampByBlockNumber({
    chainId,
    blockNumber,
  }: {
    chainId: ChainId;
    blockNumber: number;
  }) {
    return fetchTimestampByBlockNumber({ chainId, blockNumber });
  }
}
