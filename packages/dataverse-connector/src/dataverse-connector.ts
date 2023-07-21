import { Communicator, PostMessageTo } from '@dataverse/communicator';
import { WalletProvider } from '@dataverse/wallet-provider';
import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  Extension,
} from "./types";
import {
  createLensProfile,
  getLensProfileIdByHandle,
  getLensProfiles,
  detectDataverseExtension,
  getDatatokenBaseInfo,
  isCollected,
} from "@dataverse/utils";
import { ethers } from "ethers";
import { getDapp, getDapps } from "@dataverse/dapp-table-client";
import { getAddress } from "viem";
import { ExternalWallet } from "./external-wallet";

export class DataverseConnector {
  private communicator: Communicator;
  private provider?: Window['dataverse'] | WalletProvider | any;
  private externalWallet: ExternalWallet;
  isConnected?: boolean;
  wallet?: WALLET | 'Unknown';
  address?: string;
  chain?: Chain;
  appId?: string;

  constructor(postMessageTo: PostMessageTo = Extension) {
    this.externalWallet = new ExternalWallet();
    this.communicator = new Communicator({
      source: window,
      target: window.top,
      methodClass: this.externalWallet,
      postMessageTo,
    });
  }

  setPostMessageTo(postMessageTo: PostMessageTo) {
    this.communicator.setPostMessageTo(postMessageTo);
  }

  getProvider(): Window['dataverse'] | WalletProvider | any {
    return this.provider;
  }

  async connectWallet(params?: {
    wallet?: WALLET | undefined;
    provider?: Window['dataverse'] | WalletProvider | any;
  }): Promise<ReturnType[SYSTEM_CALL.connectWallet]> {
    let wallet: WALLET;
    let provider: Window['dataverse'] | WalletProvider | any;
    if (params) {
      wallet = params.wallet;
      provider = params.provider || window.dataverse;
    } else {
      provider = window.dataverse;
    }

    if (provider.isDataverse) {
      if (!(await detectDataverseExtension())) {
        throw 'The plugin has not been loaded yet. Please check the plugin status or go to https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead to install plugins';
      }
      if (wallet === WALLET.EXTERNAL_WALLET) {
        throw 'Conflict between wallet and provider';
      }
      const res = await window.dataverse.connectWallet(wallet);

      if (!this.provider) {
        this.provider = new WalletProvider();
        this.provider.on('chainChanged', (chainId: number) => {
          this.chain.chainId = chainId;
        });
        this.provider.on('chainNameChanged', (chainName: string) => {
          this.chain.chainName = chainName;
        });
        this.provider.on('accountsChanged', (accounts: string[]) => {
          this.address = accounts[0];
        });
      }

      this.isConnected = true;
      this.wallet = res.wallet;
      this.address = res.address;
      this.chain = res.chain;

      return {
        ...res,
        provider: this.provider,
      } as Awaited<ReturnType[SYSTEM_CALL.connectWallet]>;
    }

    this.externalWallet.setProvider(provider);
    this.provider = provider;
    const res = await window.dataverse.connectWallet(WALLET.EXTERNAL_WALLET);
    this.provider.removeAllListeners('chainChanged');
    this.provider.removeAllListeners('accountsChanged');
    this.provider.on('chainChanged', (networkId: string) => {
      const chainId = Number(networkId);
      this.chain.chainId = chainId;
      this.chain.chainName =
        chainId === 80001 ? 'mumbai' : chainId === 1 ? 'ethereum' : 'Unknown';
    });
    this.provider.on('accountsChanged', (accounts: string[]) => {
      this.address = getAddress(accounts[0]);
    });

    this.isConnected = true;
    this.wallet = res.wallet;
    this.address = res.address;
    this.chain = res.chain;

    return {
      wallet: this.wallet,
      address: this.address,
      chain: this.chain,
      provider: this.provider,
    } as Awaited<ReturnType[SYSTEM_CALL.connectWallet]>;
  }

  async runOS<T extends SYSTEM_CALL>({
    method,
    params,
  }: {
    method: T;
    params?: RequestType[T];
  }): Promise<Awaited<ReturnType[T]>> {
    if (method === SYSTEM_CALL.createCapability && !this?.isConnected) {
      await this.connectWallet({
        wallet: (params as RequestType[SYSTEM_CALL.createCapability]).wallet,
      });
    }

    const res = (await this.communicator.sendRequest({
      method,
      params,
    })) as ReturnType[SYSTEM_CALL];

    if (method === SYSTEM_CALL.createCapability) {
      this.appId = (params as RequestType[SYSTEM_CALL.createCapability]).appId;
    }

    return res;
  }

  getDAppTable() {
    return getDapps();
  }

  getDAppInfo(dappId: string) {
    return getDapp(dappId);
  }

  async createProfile(handle: string): Promise<string> {
    const provider = new ethers.providers.Web3Provider(this.provider, "any");
    const signer = provider.getSigner();
    const id = await getLensProfileIdByHandle({ handle, signer });
    if (id != 0) throw new Error("Handle is taken, try a new handle.");
    return createLensProfile({ handle, signer });
  }

  async getProfiles(address: string): Promise<{ id: string }[]> {
    return getLensProfiles(address);
  }

  async isCollected({
    datatokenId,
    address,
  }: {
    datatokenId: string;
    address: string;
  }): Promise<boolean> {
    return isCollected({ datatokenId, address });
  }

  async getDatatokenBaseInfo(datatokenId: string): Promise<object> {
    return getDatatokenBaseInfo(datatokenId);
  }
}
