export const Browser = "Browser";
export const Extension = "Extension";

export enum Mode {
  Read,
  Write,
}

export enum StorageProviderName {
  Web3Storage,
  Lighthouse,
}

export enum SignMethod {
  signMessage = "signMessage",
  _signTypedData = "_signTypedData",
}