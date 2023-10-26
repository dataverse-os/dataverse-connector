import { WalletProvider } from "@dataverse/wallet-provider-test";
import { StorageProviderName } from "./constants";

export interface StorageProvider {
  name: StorageProviderName;
  apiKey: string;
}

export type Provider = Window["dataverse"] | WalletProvider | any;
