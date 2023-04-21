import { Apps } from "./constants";

export type AppsInfo = Record<
  Apps,
  {
    website: string;
    logo: string;
    defaultFolderName: string;
    description: string;
    streamsNumber: number;
    isIdentityValid: boolean;
  }
>;

export type ApplicationRegistry = Record<
  Apps,
  {
    website: string;
    logo: string;
    defaultFolderName: string;
    description: string;
    ceramic: string;
    models: Record<
      string,
      { modelId: string; isPublicDomain: boolean; encryptable: string[] }
    >;
  }
>;
