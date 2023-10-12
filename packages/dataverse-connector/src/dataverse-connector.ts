import { Communicator } from "@dataverse/communicator";
import { WalletProvider } from "@dataverse/wallet-provider";
import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  Extension,
  Provider,
  AuthType,
} from "./types";
import {
  createLensProfile,
  getLensProfileIdByHandle,
  getLensProfiles,
  detectDataverseExtension,
  getDatatokenBaseInfo,
  isCollected,
  ExternalWallet,
} from "@dataverse/utils";
import { ethers } from "ethers";
import { getDapp, getDapps } from "@dataverse/dapp-table-client";
import { getAddress } from "viem";

export class DataverseConnector {
  private communicator: Communicator;
  private provider?: Provider;
  private dataverseProvider?: WalletProvider;
  private externalProvider?: any;
  private externalWallet: ExternalWallet;
  isConnected?: boolean;
  wallet?: WALLET;
  address?: string;
  chain?: Chain;
  appId?: string;

  constructor() {
    if (!window.externalWallet) {
      window.externalWallet = new ExternalWallet();
    }
    this.externalWallet = window.externalWallet;
    if (!window.dataverseCommunicator) {
      this.communicator = new Communicator({
        source: window,
        target: window.top,
        methodClass: this.externalWallet,
      });
      window.dataverseCommunicator = this.communicator;
    } else {
      this.communicator = window.dataverseCommunicator;
    }
    this.communicator.onRequestMessage(() => {});
  }

  getProvider(): Provider {
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
  }> {
    let wallet: WALLET;
    let provider: Provider;
    let preferredAuthType: AuthType;
    if (params) {
      wallet = params.wallet;
      provider = params.provider || window.dataverse;
      preferredAuthType = params.preferredAuthType;
    } else {
      provider = window.dataverse;
    }

    if (provider.isDataverse) {
      if (!(await detectDataverseExtension())) {
        throw "The plugin has not been loaded yet. Please check the plugin status or go to https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead to install plugins";
      }
      if (wallet === WALLET.EXTERNAL_WALLET) {
        throw "Conflict between wallet and provider";
      }

      this.communicator.onRequestMessage(() => {});

      const dataverseProvider = new WalletProvider();
      const res = await dataverseProvider.connectWallet({
        wallet: wallet || provider.wallet,
        preferredAuthType,
      });

      if (
        !this.isConnected ||
        (this.externalProvider && !this.dataverseProvider)
      ) {
        dataverseProvider.on("chainChanged", (chainId: number) => {
          this.chain.chainId = chainId;
        });
        dataverseProvider.on("chainNameChanged", (chainName: string) => {
          this.chain.chainName = chainName;
        });
        dataverseProvider.on("accountsChanged", (accounts: string[]) => {
          this.address = accounts[0];
        });
      }

      this.isConnected = true;
      this.wallet = res.wallet as WALLET;
      this.address = res.address;
      this.chain = res.chain;
      this.provider = dataverseProvider;
      this.dataverseProvider = dataverseProvider;

      return {
        wallet: this.wallet,
        address: this.address,
        chain: this.chain,
      };
    }

    this.externalProvider = provider;
    window.dataverseExternalProvider = provider;
    this.externalWallet.setProvider(provider);
    this.communicator.onRequestMessage(undefined);

    const dataverseProvider = new WalletProvider();
    const res = await dataverseProvider.connectWallet({
      wallet: WALLET.EXTERNAL_WALLET,
    });

    this.externalProvider.removeAllListeners("chainChanged");
    this.externalProvider.removeAllListeners("accountsChanged");
    this.externalProvider.on("chainChanged", (networkId: string) => {
      const chainId = Number(networkId);
      this.chain.chainId = chainId;
      this.chain.chainName =
        chainId === 80001 ? "mumbai" : chainId === 1 ? "ethereum" : "Unknown";
    });
    this.externalProvider.on("accountsChanged", (accounts: string[]) => {
      this.address = getAddress(accounts[0]);
    });

    this.isConnected = true;
    this.wallet = res.wallet as WALLET;
    this.address = res.address;
    this.chain = res.chain;
    this.provider = this.externalProvider;

    return {
      wallet: this.wallet,
      address: this.address,
      chain: this.chain,
    };
  }

  async getCurrentWallet(): Promise<
    | {
        address: string;
        chain: Chain;
        wallet: WALLET;
      }
    | undefined
  > {
    return window.dataverse.getCurrentWallet();
  }

  async runOS<T extends SYSTEM_CALL>({
    method,
    params,
  }: {
    method: T;
    params?: RequestType[T];
  }): Promise<Awaited<ReturnType[T]>> {
    if (
      method !== SYSTEM_CALL.checkCapability &&
      method !== SYSTEM_CALL.loadStream &&
      method !== SYSTEM_CALL.loadStreamsBy &&
      method !== SYSTEM_CALL.getModelBaseInfo &&
      !this?.isConnected
    ) {
      throw new Error("Please connect wallet first");
    }

    const res = (await this.communicator.sendRequest({
      method,
      params,
      postMessageTo: Extension,
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

  getCurrentPkh(): string {
    if (!this.address) {
      throw new Error("Please connect wallet first");
    }
    return `did:pkh:eip155:1:${this.address}`;
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
