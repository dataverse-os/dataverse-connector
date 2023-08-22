import {
  DecryptionConditions,
  DecryptionConditionsTypes,
} from "../../data-monetize";

export enum EncryptionProtocol {
  Lit,
}

export interface EncryptionProvider {
  protocol: EncryptionProtocol;
  encryptedSymmetricKey?: string;
  decryptionConditions?: DecryptionConditions;
  decryptionConditionsType?: DecryptionConditionsTypes;
}

export enum MonetizationProtocol {
  Lens,
}

export interface MonetizationProvider {
  protocol: MonetizationProtocol;
  chainId: number;
  baseContract: string;
  unionContract: string;
  datatokenId?: string;
  dataUnionIds?: string[];
}

export interface AccessControl {
  encryptionProvider?: EncryptionProvider;
  monetizationProvider?: MonetizationProvider;
}
