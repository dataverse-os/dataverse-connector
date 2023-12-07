import { ChainId, GraphType } from "@dataverse/contracts-sdk/data-token";

export enum Currency {
  USDC = "USDC",
  DAI = "DAI",
  WETH = "WETH",
  WMATIC = "WMATIC",
}

export enum DecryptionConditionsTypes {
  AccessControlCondition = "AccessControlCondition",
  UnifiedAccessControlCondition = "UnifiedAccessControlCondition",
}

export { ChainId, GraphType as DatatokenType };
