import { WALLET } from "@dataverse/dataverse-connector";

declare global {
  interface Window {
    dataverse: {
      wallet: WALLET;
    };
  }
}
