import { DecryptionConditionsType, EncryptionProtocol } from "./constants";

export interface AccessControlCondition {
  conditionType?: string;
  contractAddress: string;
  chain: string;
  standardContractType: string;
  method: string;
  parameters: string[];
  returnValueTest: ReturnValueTest;
}

export interface UnifiedAccessControlCondition {
  contractAddress: string;
  conditionType: string;
  standardContractType?: string;
  method?: string;
  parameters?: string[];
  functionName: string;
  functionParams: (string | number)[];
  functionAbi: {
    inputs: { internalType: string; name: string; type: string }[];
    name: string;
    outputs: { internalType: string; name: string; type: string }[];
  };
  chain: string;
  returnValueTest: {
    key: string;
    comparator: string;
    value: string;
  };
}

export type DecryptionConditions = (
  | AccessControlCondition
  | BooleanCondition
  | (UnifiedAccessControlCondition | BooleanCondition)[]
)[];

export interface BooleanCondition {
  operator: "and" | "or" | string;
}

export interface ReturnValueTest {
  comparator: string;
  value: string;
}

export interface EncryptionProvider {
  protocol: EncryptionProtocol;
  encryptedSymmetricKey?: string;
  decryptionConditions?: DecryptionConditions;
  decryptionConditionsType?: DecryptionConditionsType;
  unlockingTimeStamp?: number;
}

export interface MonetizationProvider {
  dataAsset?: DataAsset;
  dependency?: Dependency;
}

export interface DataAsset {
  assetType: string;
  assetId: string;
  assetContract: string;
  chainId: number;
}

export interface Dependency {
  linkedAsset: DataAsset;
  blockNumber?: number;
}

export interface AccessControl {
  encryptionProvider?: EncryptionProvider;
  monetizationProvider?: MonetizationProvider;
}
