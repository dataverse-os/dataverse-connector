import EventEmitter from "eventemitter3";
import { ConnecterEvents } from "./types";
import { ethers, Bytes } from "ethers";
import { Deferrable } from "ethers/lib/utils";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/providers";
import { formatSendTransactionData } from "@dataverse/utils";

export class WalletProvider extends EventEmitter<ConnecterEvents> {
  private ethersProvider: ethers.providers.Web3Provider;
  isDataverse = true;

  constructor() {
    super();
    this.ethersProvider = new ethers.providers.Web3Provider(this, "any");
  }

  signMessage(message: Bytes | string): Promise<string> {
    return window.dataverse.sign({
      method: "signMessage",
      params: [message],
    });
  }

  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, Array<TypedDataField> | string>
  ): Promise<string> {
    return window.dataverse.sign({
      method: "_signTypedData",
      params: [domain, types, message],
    });
  }

  signTransaction(): Promise<string> {
    throw new Error("'signTransaction' is unsupported !");
  }

  async sendTransaction(
    transaction: Deferrable<TransactionRequest> | (string | Promise<string>)
  ): Promise<TransactionResponse> {
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
      const signer = this.ethersProvider.getSigner();
      return signer.sendTransaction(transaction);
    } else {
      return window.dataverse.request({
        method: "eth_sendTransaction",
        params: [transaction],
      });
    }
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
