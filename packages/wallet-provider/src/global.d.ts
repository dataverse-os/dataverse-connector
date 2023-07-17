interface Window {
  dataverse: {
    request: ({
      method,
      params,
    }: {
      method: string;
      params: Array<any>;
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
}
