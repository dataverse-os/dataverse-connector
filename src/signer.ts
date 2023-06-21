import { Bytes, VoidSigner, Signer as _Signer } from "ethers";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { RuntimeConnector } from "./runtime-connector";
import { SignMethod } from "./types/constants";

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
    value: Record<string, any>
  ): Promise<string> {
    return this.runtimeConnector.sign({
      method: SignMethod._signTypedData,
      params: [domain, types, value],
    });
  }

  signTransaction(): Promise<string> {
    throw new Error("'signTransaction' is unsupported !");
  }

  connect(): Signer {
    return this;
  }
}
