export interface DAppInfo {
  address: string;
  ceramic: string;
  createdAt: number;
  defaultFolderName: string;
  deletedAt?: number | null;
  description: string;
  id: string;
  logo: string;
  models: Models;
  name: string;
  updatedAt: number;
  website: string[];
}

export type DAppTable = DAppInfo[];

export interface Model {
  internal: boolean;
  modelName: string;
  streams: {
    createdAt: number;
    encryptable: string[];
    isPublicDomain: boolean;
    latest: boolean;
    modelId: string;
    schema: string;
    version: number;
  }[];
}

export type Models = Model[];

export type ValidAppCaps = (DAppInfo & {
  streamsNumber: number;
  isIdentityValid: boolean;
})[];
