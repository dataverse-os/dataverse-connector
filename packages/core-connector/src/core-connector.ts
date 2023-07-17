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
import web3 from "web3";

export class CoreConnector {
  private communicator: Communicator;
  private provider?: Window["dataverse"] | WalletProvider | any;
  isConnected?: boolean;
  wallet?: WALLET | "Unknown";
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

  async connectWallet({
    wallet,
    provider = window.dataverse,
  }: {
    wallet?: RequestType[Methods.connectWallet];
    provider?: Window["dataverse"] | WalletProvider | any;
  }): Promise<ReturnType[Methods.connectWallet]> {
    if (provider.isDataverse) {
      if (!(await detectDataverseExtension())) {
        throw "The plugin has not been loaded yet. Please check the plugin status or go to https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead to install plugins";
      }

      const res = await window.dataverse.connectWallet(wallet);

      this.provider = new WalletProvider();
      this.provider.off("chainChanged");
      this.provider.off("chainNameChanged");
      this.provider.off("accountsChanged");
      this.provider.on("chainChanged", (chainId: number) => {
        this.chain.chainId = chainId;
      });
      this.provider.on("chainNameChanged", (chainName: string) => {
        this.chain.chainName = chainName;
      });
      this.provider.on("accountsChanged", (accounts: string[]) => {
        this.address = accounts[0];
      });

      this.isConnected = true;
      this.wallet = res.wallet;
      this.address = res.address;
      this.chain = res.chain;

      return {
        ...res,
        provider: this.provider,
      } as Awaited<ReturnType[Methods.connectWallet]>;
    }

    this.provider = provider;
    this.provider.removeAllListeners("chainChanged");
    this.provider.removeAllListeners("accountsChanged");
    this.provider.on("chainChanged", (networkId: string) => {
      const chainId = Number(networkId);
      this.chain.chainId = chainId;
      this.chain.chainName =
        chainId === 80001 ? "mumbai" : chainId === 1 ? "ethereum" : "Unknown";
    });
    this.provider.on("accountsChanged", (accounts: string[]) => {
      this.address = web3.utils.toChecksumAddress(accounts[0]);
    });
    this.isConnected = true;
    this.wallet = this.provider.isMetaMask ? WALLET.METAMASK : "Unknown";

    this.address = web3.utils.toChecksumAddress(
      (
        await this.provider.request({
          method: "eth_accounts",
          params: [],
        })
      )?.[0]
    );
    const chainId = Number(
      await this.provider.request({
        method: "eth_chainId",
        params: [],
      })
    );
    this.chain = {
      chainId,
      chainName:
        chainId === 80001 ? "mumbai" : chainId === 1 ? "ethereum" : "Unknown",
    };
    return {
      wallet: this.wallet,
      address: this.address,
      chain: this.chain,
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
      await this.connectWallet({
        wallet: (params as RequestType[Methods.createCapability]).wallet,
      });
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
