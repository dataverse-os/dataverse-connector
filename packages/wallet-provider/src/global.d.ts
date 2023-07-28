import { Communicator } from "@dataverse/communicator";
import { ExternalWallet } from "@dataverse/utils";

declare global {
  interface Window {
    dataverse: {
      isDataverse: boolean;
      connectWallet: (wallet: string) => Promise<{
        address: string;
        chain: { chainId: number; chainName: string };
        wallet: string;
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
