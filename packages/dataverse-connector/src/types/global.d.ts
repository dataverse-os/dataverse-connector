interface Window {
  dataverse: {
    isDataverse: boolean;
    connectWallet: (wallet?: WALLET | undefined) => Promise<{
      address: string;
      chain: Chain;
      wallet: WALLET;
    }>;
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
