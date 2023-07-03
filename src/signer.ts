import { Bytes, VoidSigner, Signer as _Signer } from "ethers";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { RuntimeConnector } from "./runtime-connector";
import { SignMethod } from "./types/constants";
import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import { Deferrable } from "ethers/lib/utils";
import { formatSendTransactionData } from "./utils/formatSendTransactionData";

export class Signer extends VoidSigner {
  runtimeConnector: RuntimeConnector;

  constructor(runtimeConnector: RuntimeConnector) {
    super(runtimeConnector.address, runtimeConnector.provider);
    this.runtimeConnector = runtimeConnector;
  }

  async getAddress(): Promise<string> {
    const res = await this.runtimeConnector.ethereumRequest({
      method: "eth_accounts",
    });
    return res[0];
  }

  signMessage(message: Bytes | string): Promise<string> {
    return this.runtimeConnector.sign({
      method: SignMethod.signMessage,
      params: [message],
    });
  }

  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, Array<TypedDataField> | string>
  ): Promise<string> {
    return this.runtimeConnector.sign({
      method: SignMethod._signTypedData,
      params: [domain, types, message],
    });
  }

  signTransaction(): Promise<string> {
    throw new Error("'signTransaction' is unsupported !");
  }

  async sendTransaction(
    transaction: Deferrable<TransactionRequest>
  ): Promise<TransactionResponse> {
    if (transaction && typeof transaction === "object") {
      if (!transaction?.from) {
        transaction.from = this.address;
      }
      Object.entries(transaction).forEach(([key, value]) => {
        if (formatSendTransactionData(value)) {
          transaction[key] = formatSendTransactionData(value);
        } else {
          delete transaction[key];
        }
      });
    }

    const signer = this.runtimeConnector.provider.ethersProvider.getSigner();
    const res = await signer.sendTransaction(transaction);
    return res;
    // return this.runtimeConnector.ethereumRequest({
    //   method: "eth_sendTransaction",
    //   params: [transaction],
    // });
  }
}
