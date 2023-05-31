export const Browser = "Browser";
export const Extension = "Extension";

export enum Mode {
  Read,
  Write,
}

export enum UploadProviderName {
  Web3Storage,
  Lighthouse,
}

export interface UploadProvider {
  name: UploadProviderName;
  apiKey: string;
}
