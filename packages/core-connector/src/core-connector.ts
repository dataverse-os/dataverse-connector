import { Communicator, PostMessageTo } from "@dataverse/communicator";
import { WalletProvider } from "@dataverse/wallet-provider";
import {
  RequestType,
  Methods,
  ReturnType,
  Chain,
  WALLET,
  Extension,
} from "./types";
import {
  detectDataverseExtension,
  formatSendTransactionData,
} from "@dataverse/utils";
import { getDapp, getDapps } from "@dataverse/dapp-table-client";

export class CoreConnector {
  private communicator: Communicator;
  private provider?: WalletProvider;
  isConnected?: boolean;
  wallet?: WALLET;
  address?: string;
  chain?: Chain;
  app?: string;

  constructor(postMessageTo: PostMessageTo = Extension) {
    this.communicator = new Communicator({
      source: window,
      target: window.top,
      postMessageTo,
    });
  }

  setPostMessageTo(postMessageTo: PostMessageTo) {
    this.communicator.setPostMessageTo(postMessageTo);
  }

  getProvider() {
    return this.provider;
  }

  async connectWallet(
    wallet?: RequestType[Methods.connectWallet]
  ): Promise<ReturnType[Methods.connectWallet]> {
    if (!(await detectDataverseExtension())) {
      throw "The plugin has not been loaded yet. Please check the plugin status or go to https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead to install plugins";
    }
    const res = await window.dataverse.connectWallet(wallet);
    if (!this.provider) {
      this.provider = new WalletProvider();
      this.provider.on("chainChanged", (chainId: number) => {
        this.chain.chainId = chainId;
      });
      this.provider.on("chainNameChanged", (chainName: string) => {
        this.chain.chainName = chainName;
      });
      this.provider.on("accountsChanged", (accounts: string[]) => {
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
    } as Awaited<ReturnType[Methods.connectWallet]>;
  }

  async runOS<T extends Methods>({
    method,
    params,
  }: {
    method: T;
    params?: RequestType[T];
  }): Promise<Awaited<ReturnType[T]>> {
    if (method === Methods.createCapability && !this?.isConnected) {
      await this.connectWallet(
        (params as RequestType[Methods.createCapability]).wallet
      );
    } else if (method === Methods.ethereumRequest) {
      // params = params as RequestType[Methods.ethereumRequest];
      if (
        (params as RequestType[Methods.ethereumRequest]).method ===
        "eth_sendTransaction"
      ) {
        if (
          !(params as RequestType[Methods.ethereumRequest])?.params?.[0]?.from
        ) {
          (params as RequestType[Methods.ethereumRequest]).params[0].from =
            this.address;
        }
        if ((params as RequestType[Methods.ethereumRequest])?.params?.[0]) {
          Object.entries(
            (params as RequestType[Methods.ethereumRequest])?.params?.[0]
          ).forEach(([key, value]) => {
            (params as RequestType[Methods.ethereumRequest]).params[0][key] =
              formatSendTransactionData(value);
          });
        }
      }
    }

    const res = (await this.communicator.sendRequest({
      method,
      params,
    })) as ReturnType[Methods];

    if (method === Methods.createCapability) {
      this.app = (params as RequestType[Methods.createCapability]).app;
    }

    return res;
  }

  getDAppTable() {
    return getDapps();
  }

  getDAppInfo(dappId: string) {
    return getDapp(dappId);
  }
}
