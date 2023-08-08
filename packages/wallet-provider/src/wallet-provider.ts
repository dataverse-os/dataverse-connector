import EventEmitter from "eventemitter3";
import { Communicator } from "@dataverse/communicator";
import { ConnecterEvents } from "./types";
import { ethers, Bytes, Contract } from "ethers";
import { Deferrable } from "ethers/lib/utils";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/providers";
import {
  convertTxData,
  formatSendTransactionData,
  ExternalWallet,
} from "@dataverse/utils";

export class WalletProvider extends EventEmitter<ConnecterEvents> {
  private signer: ethers.providers.JsonRpcSigner;
  isDataverse = true;
  isConnected?: boolean;
  address?: string;
  chain?: {
    chainId: number;
    chainName: string;
  };
  wallet?: string;

  constructor() {
    super();
    if (!window.externalWallet) {
      window.externalWallet = new ExternalWallet();
    }
    window.externalWallet.setProvider(window.dataverseExternalProvider);

    if (!window.dataverseCommunicator) {
      window.dataverseCommunicator = new Communicator({
        source: window,
        target: window.top,
        methodClass: window.externalWallet,
      });
    }
  }

  async connectWallet(wallet?: string) {
    const res = await window.dataverse.connectWallet(wallet);
    this.address = res.address;
    this.chain = res.chain;
    this.wallet = res.wallet;
    const provider = new ethers.providers.Web3Provider(this, "any");
    this.signer = provider.getSigner();
    return res;
  }

  async getCurrentWallet() {
    return window.dataverse.getCurrentWallet();
  }

  getAddress() {
    return this.address;
  }

  async signMessage(message: Bytes | string): Promise<string> {
    if (!this.signer) {
      await this.connectWallet();
    }
    return this.signer.signMessage(message);
  }

  async _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, Array<TypedDataField> | string>,
  ): Promise<string> {
    if (!this.signer) {
      await this.connectWallet();
    }
    return this.signer._signTypedData(domain, types, message);
  }

  async sendTransaction(
    transaction: Deferrable<TransactionRequest> | (string | Promise<string>),
  ): Promise<TransactionResponse> {
    if (!this.signer) {
      await this.connectWallet();
    }
    if (transaction && typeof transaction === "object") {
      transaction = transaction as TransactionRequest;
      if (!transaction?.from) {
        const res = await window.dataverse.request({
          method: "eth_accounts",
          params: [],
        });
        transaction.from = res[0];
      }
      Object.entries(transaction).forEach(([key, value]) => {
        if (key !== "from" && key !== "to") {
          if (formatSendTransactionData(value)) {
            transaction[key] = formatSendTransactionData(value);
          } else {
            delete transaction[key];
          }
        }
      });
      return this.signer.sendTransaction(transaction);
    } else {
      return window.dataverse.request({
        method: "eth_sendTransaction",
        params: [transaction],
      });
    }
  }

  async contractCall({
    contractAddress,
    abi,
    method,
    params,
  }: {
    contractAddress: string;
    abi: any[];
    method: string;
    params?: any[];
  }): Promise<any> {
    if (!this.signer) {
      await this.connectWallet();
    }
    const contract = new Contract(contractAddress, abi, this.signer);
    const tx = await (params
      ? contract[method](...params)
      : contract[method]());
    if (tx && typeof tx === "object" && tx.wait) {
      let res = await tx.wait();
      res = convertTxData(res);
      return res;
    }
    return tx;
  }

  on(event: string, listener: Function) {
    window.dataverse.on(event, listener);
    return this;
  }

  off(event: string, listener?: Function) {
    window.dataverse.off(event, listener);
    return this;
  }

  request({ method, params }: { method: string; params?: Array<any> }) {
    return window.dataverse.request({ method, params });
  }
}
