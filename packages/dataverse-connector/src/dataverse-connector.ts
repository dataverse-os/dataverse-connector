import { ethers } from "ethers";
import { getAddress } from "viem";
import { Communicator } from "@dataverse/communicator";
import { WalletProvider } from "@dataverse/wallet-provider";
import { detectDataverseExtension, ExternalWallet } from "@dataverse/utils";
import { getDapp, getDapps } from "@dataverse/dapp-table-client";
import {
  createLensProfile,
  getLensProfiles,
  getLensProfileIdByHandle,
  getHandleByLensProfileId,
} from "@dataverse/dataverse-contracts-sdk/data-token";
import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  Extension,
  Provider,
  AuthType,
  ChainId,
} from "./types";
import { getTimestampByBlockNumber as fetchTimestampByBlockNumber } from "@dataverse/dataverse-contracts-sdk";

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
  userInfo?: any;

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
    userInfo?: any;
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
      this.userInfo = res.userInfo;
      this.provider = dataverseProvider;
      this.dataverseProvider = dataverseProvider;

      return {
        wallet: this.wallet,
        address: this.address,
        chain: this.chain,
        userInfo: this.userInfo,
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
      window.dataverseCommunicator?.sendRequest({
        method: "chainChanged",
        params: {
          chain: { chainId: Number(networkId), chainName: "Unknown" },
          wallet: this.wallet,
        },
        postMessageTo: "Browser",
      });
    });
    this.externalProvider.on("accountsChanged", (accounts: string[]) => {
      this.address = getAddress(accounts[0]);
      window.dataverseCommunicator?.sendRequest({
        method: "accountsChanged",
        params: {
          accounts: accounts.map(account => getAddress(account)),
          wallet: this.wallet,
        },
        postMessageTo: "Browser",
      });
    });

    this.isConnected = true;
    this.wallet = res.wallet as WALLET;
    this.address = res.address;
    this.chain = res.chain;
    this.userInfo = res.userInfo;
    this.provider = this.externalProvider;

    return {
      wallet: this.wallet,
      address: this.address,
      chain: this.chain,
      userInfo: this.userInfo,
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
      method !== SYSTEM_CALL.loadFile &&
      method !== SYSTEM_CALL.loadFilesBy &&
      method !== SYSTEM_CALL.getModelBaseInfo &&
      method !== SYSTEM_CALL.loadDatatokensByCreator &&
      method !== SYSTEM_CALL.loadDatatokensByCollector &&
      method !== SYSTEM_CALL.loadDatatokenDetail &&
      method !== SYSTEM_CALL.loadDatatokenDetailsBy &&
      method !== SYSTEM_CALL.loadDatatokenCollectors &&
      method !== SYSTEM_CALL.isDatatokenCollectedBy &&
      method !== SYSTEM_CALL.loadDataUnionsByPublisher &&
      method !== SYSTEM_CALL.loadDataUnionsByCollector &&
      method !== SYSTEM_CALL.loadDataUnionDetail &&
      method !== SYSTEM_CALL.loadDataUnionCollectors &&
      method !== SYSTEM_CALL.loadDataUnionSubscribers &&
      method !== SYSTEM_CALL.loadDataUnionSubscriptionListByCollector &&
      method !== SYSTEM_CALL.isDataUnionCollectedBy &&
      method !== SYSTEM_CALL.isDataUnionSubscribedBy &&
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

    const provider = new ethers.providers.Web3Provider(this.provider, "any");
    const signer = provider.getSigner();

    const id = await getLensProfileIdByHandle({
      chainId,
      signerOrProvider: signer,
      handle,
    });

    if (id.toNumber() != 0)
      throw new Error("Handle is taken, try a new handle.");

    const profile = await createLensProfile({
      chainId,
      handle,
      signer,
    });

    return profile.toHexString();
  }

  async getProfiles({
    chainId,
    address,
  }: {
    chainId: ChainId;
    address: string;
  }): Promise<{ id: string }[]> {
    let provider: ethers.providers.Web3Provider;
    if (chainId && this.chain?.chainId === chainId) {
      provider = new ethers.providers.Web3Provider(this.provider, "any");
    }

    const res = await getLensProfiles({
      chainId,
      account: address,
      signerOrProvider: provider,
    });

    return res.map(item => ({ id: item.toHexString() }));
  }

  async getProfileIdByHandle({
    chainId,
    handle,
  }: {
    chainId: ChainId;
    handle: string;
  }): Promise<string> {
    let provider: ethers.providers.Web3Provider;
    if (chainId && this.chain?.chainId === chainId) {
      provider = new ethers.providers.Web3Provider(this.provider, "any");
    }

    const res = await getLensProfileIdByHandle({
      chainId,
      handle,
      signerOrProvider: provider,
    });

    return res.toHexString();
  }

  async getHandleByProfileId({
    chainId,
    profileId,
  }: {
    chainId: ChainId;
    profileId: string;
  }): Promise<string> {
    let provider: ethers.providers.Web3Provider;
    if (chainId && this.chain?.chainId === chainId) {
      provider = new ethers.providers.Web3Provider(this.provider, "any");
    }

    const res = await getHandleByLensProfileId({
      chainId,
      profileId,
      signerOrProvider: provider,
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
