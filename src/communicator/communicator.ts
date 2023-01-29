import { init } from "@dataverse/dataverse-kernel";
import { Browser, ENV, Extension, Node } from "@dataverse/dataverse-kernel/dist/cjs/constants";
import { Methods, RequestType } from "@dataverse/dataverse-kernel/dist/cjs/event";
import { ethers } from "ethers";
import { RuntimeConnector } from "../runtimeConnector";


export class Communicator {
  private runtimeConnector: RuntimeConnector;
  constructor() {
    switch (process.env.ENV) {
      case Browser: {
        this.runtimeConnector = new RuntimeConnector(window, window.top);
        break;
      }
      case Extension: {
        this.runtimeConnector = new RuntimeConnector(window, window);
      }
    }
  }

  async call({
    method,
    parameters,
  }: {
    method: Methods;
    parameters: RequestType[Methods];
  }) {
    this.runtimeConnector.sendRequest({ method, parameters });
  }
}
