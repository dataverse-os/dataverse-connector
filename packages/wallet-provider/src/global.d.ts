import { Communicator } from "@dataverse/communicator";
import { ExternalWallet } from "@dataverse/utils";

declare global {
  interface Window {
    dataverse: {
      isDataverse: boolean;
      connectWallet: (
        params:
          | {
              wallet?: string;
              preferredAuthType?: string;
            }
          | undefined,
      ) => Promise<{
        address: string;
        chain: { chainId: number; chainName: string };
        wallet: string;
        userInfo?: any;
      }>;
      getCurrentWallet: () => Promise<{
        address: string;
        chain: { chainId: number; chainName: string };
        wallet: string;
      }>;
      request: ({
        method,
        params,
      }: {
        method: string;
        params?: Array<any>;
      }) => Promise<any>;
      on: (event: string, listener: Function) => void;
      off: (event: string, listener?: Function) => void;
      sign: ({
        method,
        params,
      }: {
        method: string;
        params: Array<any>;
      }) => Promise<string>;
    };
    externalWallet: ExternalWallet;
    dataverseExternalProvider: any;
    dataverseCommunicator: Communicator;
  }
}
