import { getAddress } from "viem";
import { Communicator } from "@dataverse/communicator";
import { WalletProvider } from "@dataverse/wallet-provider";
import { detectDataverseExtension, ExternalWallet } from "@dataverse/utils";
import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  Extension,
  Provider,
  AuthType,
} from "../types";
import { BaseProvider } from "./base-provider";
import { IProvider } from "./types";

export class DataWalletProvider extends BaseProvider implements IProvider {
  private communicator: Communicator;
  private dataverseProvider?: WalletProvider;
  private externalProvider?: any;
  private externalWallet: ExternalWallet;

  constructor() {
    super();
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

  connectWallet = async (params?: {
    wallet?: WALLET | undefined;
    preferredAuthType?: AuthType;
    provider?: Provider;
  }): Promise<{
    address: string;
    chain: Chain;
    wallet: WALLET;
    userInfo?: any;
  }> => {
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
      this._provider = dataverseProvider;
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
    this._provider = this.externalProvider;

    return {
      wallet: this.wallet,
      address: this.address,
      chain: this.chain,
      userInfo: this.userInfo,
    };
  };

  getCurrentWallet = async (): Promise<
    | {
        address: string;
        chain: Chain;
        wallet: WALLET;
      }
    | undefined
  > => {
    return window.dataverse.getCurrentWallet();
  };

  runOS = async <T extends SYSTEM_CALL>({
    method,
    params,
  }: {
    method: T;
    params?: RequestType[T];
  }): Promise<Awaited<ReturnType[T]>> => {
    if (
      method !== SYSTEM_CALL.checkCapability &&
      method !== SYSTEM_CALL.loadFile &&
      method !== SYSTEM_CALL.loadFilesBy &&
      method !== SYSTEM_CALL.getModelBaseInfo &&
      method !== SYSTEM_CALL.loadDatatokens &&
      method !== SYSTEM_CALL.isDatatokenCollectedBy &&
      method !== SYSTEM_CALL.loadDataUnions &&
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
  };
}
