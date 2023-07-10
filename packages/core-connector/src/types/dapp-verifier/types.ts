export type AppsInfo = Record<
  string,
  {
    website: string;
    logo: string;
    defaultFolderName: string;
    description: string;
    streamsNumber: number;
    isIdentityValid: boolean;
  }
>;

export interface ModelInfo {
  modelName: string;
  modelId: string;
  isPublicDomain: boolean;
  encryptable: string[];
}

export type Models = Record<string, ModelInfo>;

export interface DAppInfo {
  website: string;
  logo: string;
  defaultFolderName: string;
  description: string;
  ceramic: string;
  models: Models;
}

export type DAppTable = Record<string, DAppInfo>;
