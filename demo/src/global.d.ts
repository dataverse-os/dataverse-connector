import { RequestType, ReturnType, Methods } from "@dataverse/core-connector";

declare global {
  interface Window {
    dataverse: {
      isDataverse: boolean;
      connectWallet: (
        params?: RequestType[Methods.connectWallet]
      ) => ReturnType[Methods.connectWallet];
      request: ({
        method,
        params,
      }: {
        method: string;
        params?: Array<any>;
      }) => Promise<any>;
      on: (event: string, listener: Function) => void;
      sign: ({
        method,
        params,
      }: {
        method: string;
        params: Array<any>;
      }) => Promise<string>;
    };
    ethereum: any;
  }
}
