import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  AuthType
} from "../types";
import { BaseProvider } from "./base-provider";

export const defaultSnapOrigin =
  process.env.SNAP_ORIGIN ?? `local:http://localhost:8080`;

export class SnapProvider extends BaseProvider {
  private snapOrigin: string;

  constructor(snapOrigin: string = defaultSnapOrigin) {
    super();
    this.snapOrigin = snapOrigin;
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
    let res = await (window as any).ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.snapOrigin,
        request: {
          method: "connectWallet",
          ...(params ? params : {})
        }
      }
    });

    if (res.error) {
      throw res.error;
    }
    res = res.result;

    this.isConnected = true;
    this.wallet = res.wallet as WALLET;
    this.address = res.address;
    this.chain = res.chain;
    this.userInfo = res.userInfo;
    this._provider = {
      on(event, listener) {
        return (window as any).ethereum.on(event, listener);
      },
      off(event, listener) {
        return (window as any).ethereum.on(event, listener);
      },
      request: async ({ method, params }) => {
        return await (window as any).ethereum.request({
          method: "wallet_invokeSnap",
          params: {
            snapId: this.snapOrigin,
            request: {
              method: `ETHEREUM_REQUEST_${method}`,
              ...(params instanceof Object
                ? { params }
                : { params: { __PARAM__: params } })
            }
          }
        });
      }
    };

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

    const res = await (window as any).ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.snapOrigin,
        request: {
          method,
          ...(params instanceof Object
            ? { params }
            : { params: { __PARAM__: params } })
        }
      }
    });

    if (res.error) {
      throw res.error;
    }

    if (method === SYSTEM_CALL.createCapability) {
      this.appId = (params as RequestType[SYSTEM_CALL.createCapability]).appId;
    }

    return res.result as ReturnType[SYSTEM_CALL];
  };
}
