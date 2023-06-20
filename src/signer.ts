import { Bytes, Signer as _Signer } from "ethers";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { RuntimeConnector } from "./runtime-connector";
import { SignMethod } from "./types/constants";
import { ReturnType, Methods } from "./types/event";

export class Signer extends _Signer {
  private runtimeConnector: RuntimeConnector;
  private walletInfo: Awaited<ReturnType[Methods.connectWallet]>;

  constructor({
    runtimeConnector,
    walletInfo,
  }: {
    runtimeConnector: RuntimeConnector;
    walletInfo: Awaited<ReturnType[Methods.connectWallet]>;
  }) {
    super();
    this.runtimeConnector = runtimeConnector;
    this.walletInfo = walletInfo;
  }

  public connect(): _Signer {
    return this;
  }

  public async signMessage(message: Bytes | string): Promise<string> {
    return await this.runtimeConnector.sign({
      method: SignMethod.signMessage,
      params: [message],
    });
  }

  public async _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): Promise<string> {
    return await this.runtimeConnector.sign({
      method: SignMethod._signTypedData,
      params: [domain, types, value],
    });
  }

  public async getAddress(): Promise<string> {
    return this.walletInfo.address;
  }

  public signTransaction(): Promise<string> {
    throw new Error("'signTransaction' is unsupported !");
  }
}
