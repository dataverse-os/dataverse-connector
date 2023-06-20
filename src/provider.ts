import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { ExternalProvider } from "@ethersproject/providers";
import { RuntimeConnector } from "./runtime-connector";
import { ReturnType, Methods } from "./types/event";

export class Provider implements ExternalProvider {
  private runtimeConnector: RuntimeConnector;

  constructor({
    runtimeConnector,
    walletInfo,
  }: {
    runtimeConnector: RuntimeConnector;
    walletInfo: Awaited<ReturnType[Methods.connectWallet]>;
  }) {
    this.runtimeConnector = runtimeConnector;
  }

  sendAsync(
    { method, params }: { method: string; params?: Array<any> },
    callback: Function
  ) {
    this.runtimeConnector
      .ethereumRequest({ method, params })
      .then((res) => {
        callback(res);
      })
      .catch((err) => {
        callback(err);
      });
  }

  send(
    { method, params }: { method: string; params?: Array<any> },
    callback: Function
  ) {
    this.runtimeConnector
      .ethereumRequest({ method, params })
      .then((res) => {
        callback(res);
      })
      .catch((err) => {
        callback(err);
      });
  }

  request({ method, params }: { method: string; params?: Array<any> }) {
    return this.runtimeConnector.ethereumRequest({ method, params });
  }
}
