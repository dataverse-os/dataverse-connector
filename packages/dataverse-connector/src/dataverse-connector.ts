import { Communicator, PostMessageTo } from "@dataverse/communicator";
import { WalletProvider } from "@dataverse/wallet-provider";
import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  Extension,
} from "./types";
import {
  detectDataverseExtension,
  formatSendTransactionData,
  convertTxData,
} from "@dataverse/utils";
import { getDapp, getDapps } from "@dataverse/dapp-table-client";
import web3 from "web3";
import { Contract, ethers } from "ethers";
import { MethodClass } from "./method-class";

export class DataverseConnector {
  private communicator: Communicator;
  private provider?: Window["dataverse"] | WalletProvider | any;
  private methodClass: MethodClass;
  isConnected?: boolean;
  wallet?: WALLET | "Unknown";
  address?: string;
  chain?: Chain;
  appId?: string;

  constructor(postMessageTo: PostMessageTo = Extension) {
    this.methodClass = new MethodClass();
    this.communicator = new Communicator({
      source: window,
      target: window.top,
      methodClass: this.methodClass,
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
    params?: {
      wallet?: WALLET | undefined;
      provider?: Window["dataverse"] | WalletProvider | any;
    }
  ): Promise<ReturnType[SYSTEM_CALL.connectWallet]> {
    let wallet: WALLET;
    let provider: Window["dataverse"] | WalletProvider | any;
    if (params) {
      wallet = params.wallet;
      provider = params.provider || window.dataverse;
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
      } as Awaited<ReturnType[SYSTEM_CALL.connectWallet]>;
    }

    this.methodClass.setProvider(provider);
    this.provider = provider;
    const res = await window.dataverse.connectWallet(WALLET.EXTERNAL_WALLET);
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
    } else if (method === SYSTEM_CALL.ethereumRequest) {
      // params = params as RequestType[SYSTEM_CALL.ethereumRequest];
      if (
        (params as RequestType[SYSTEM_CALL.ethereumRequest]).method ===
        "eth_sendTransaction"
      ) {
        if (
          !(params as RequestType[SYSTEM_CALL.ethereumRequest])?.params?.[0]
            ?.from
        ) {
          (params as RequestType[SYSTEM_CALL.ethereumRequest]).params[0].from =
            this.address;
        }
        if ((params as RequestType[SYSTEM_CALL.ethereumRequest])?.params?.[0]) {
          Object.entries(
            (params as RequestType[SYSTEM_CALL.ethereumRequest])?.params?.[0]
          ).forEach(([key, value]) => {
            (params as RequestType[SYSTEM_CALL.ethereumRequest]).params[0][
              key
            ] = formatSendTransactionData(value);
          });
        }
      }
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
}
