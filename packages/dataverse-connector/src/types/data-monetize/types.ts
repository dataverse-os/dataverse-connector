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
}

export interface MonetizationProvider {
  dataAsset?: DataAsset;
  dependencies?: Dependencies;
}

export interface DataAsset {
  assetId: string;
  assetContract: string;
  chainId: number;
}

export interface Dependency {
  linkedAsset: DataAsset;
  attached?: Attached;
}

export type Attached = {
  timestamp?: number;
} & object;

export type Dependencies = Dependency[];

export interface AccessControl {
  encryptionProvider?: EncryptionProvider;
  monetizationProvider?: MonetizationProvider;
}
