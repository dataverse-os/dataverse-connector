import EventEmitter from "eventemitter3";
import { ConnecterEvents } from "./types";
import { ethers, Bytes, Signer } from "ethers";
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
  private signer: ethers.providers.JsonRpcSigner;
  isDataverse = true;

  async connectWallet(wallet?: string) {
    const res = await window.dataverse.connectWallet(wallet);
    const provider = new ethers.providers.Web3Provider(this, "any");
    this.signer = provider.getSigner();
    return res;
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
    message: Record<string, Array<TypedDataField> | string>
  ): Promise<string> {
    if (!this.signer) {
      await this.connectWallet();
    }
    return this.signer._signTypedData(domain, types, message);
  }

  async sendTransaction(
    transaction: Deferrable<TransactionRequest> | (string | Promise<string>)
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
