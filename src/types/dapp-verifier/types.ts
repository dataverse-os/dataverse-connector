import { Apps } from "./constants";

export type AppsInfo = Record<
  Apps,
  {
    website: string;
    logo: string;
    defaultFolderName: string;
    streamsNumber: number;
    isIdentityValid: boolean;
  }
>;
