import { RequestType, ReturnType, SYSTEM_CALL } from "./system-call";

declare global {
  interface Window {
    dataverse: {
      isDataverse: boolean;
      connectWallet: (
        params?: RequestType[SYSTEM_CALL.connectWallet],
      ) => ReturnType[SYSTEM_CALL.connectWallet];
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
    provider: any;
  }
}
