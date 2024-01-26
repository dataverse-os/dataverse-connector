import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  AuthType
} from "../types";
import { BaseProvider } from "./base-provider";
import { IframeCommunicator } from "meteor-iframe";

declare global {
  interface Window {
    ethereum: any;
  }
}

export class MeteorIframeProvider extends BaseProvider {
  private communicator: IframeCommunicator;

  constructor(iframeWindow: Window) {
    super();
    this.communicator = new IframeCommunicator({
      source: window,
      target: iframeWindow,
      runningEnv: "Client",
      methodHandler: async (args) => {
        console.log("Client received method call:", args);
        if (args.method === "ethereumRequest") {
          const res = await window.ethereum.request(args.params);
          console.log("Client responded to ethereumRequest:", res);
          return res;
        }
      }
    });
  }

  connectWallet = async (params?: {
    wallet?: WALLET | undefined;
    preferredAuthType?: AuthType;
  }): Promise<{
    address: string;
    chain: Chain;
    wallet: WALLET;
    userInfo?: any;
  }> => {
    const res = (await this.communicator.sendRequest({
      postMessageTo: "Kernel",
      method: "connectWallet",
      params
    })) as {
      address: string;
      chain: {
        chainId: number;
        chainName: string;
      };
      wallet: string;
      userInfo?: any;
    };

    this.isConnected = true;
    this.wallet = res.wallet as WALLET;
    this.address = res.address;
    this.chain = res.chain;
    this.userInfo = res.userInfo;
    this._provider = window.ethereum;

    return {
      wallet: this.wallet,
      address: this.address,
      chain: this.chain,
      userInfo: this.userInfo
    };
  };

  getCurrentWallet = async (): Promise<
    | {
        address: string;
        chain: Chain;
        wallet: WALLET;
      }
    | undefined
  > => {
    return {
      wallet: this.wallet,
      address: this.address,
      chain: this.chain
    };
  };

  runOS = async <T extends SYSTEM_CALL>({
    method,
    params
  }: {
    method: T;
    params?: RequestType[T];
  }): Promise<Awaited<ReturnType[T]>> => {
    if (
      method !== SYSTEM_CALL.checkCapability &&
      method !== SYSTEM_CALL.loadFile &&
      method !== SYSTEM_CALL.loadFilesBy &&
      (method !== SYSTEM_CALL.loadFilesBy ||
        (method === SYSTEM_CALL.loadFilesBy &&
          (params as RequestType[SYSTEM_CALL.loadFilesBy]).fileIds)) &&
      !this?.isConnected
    ) {
      throw new Error("Please connect wallet first");
    }

    const res = await this.communicator.sendRequest({
      postMessageTo: "Kernel",
      method,
      params
    });

    if (method === SYSTEM_CALL.createCapability) {
      this.appId = (params as RequestType[SYSTEM_CALL.createCapability]).appId;
    }

    return res as ReturnType[SYSTEM_CALL];
  };
}
