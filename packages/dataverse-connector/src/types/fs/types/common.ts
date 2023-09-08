import {
  DecryptionConditions,
  DecryptionConditionsTypes,
} from "../../data-monetize";
import { ReturnType, SYSTEM_CALL } from "../../system-call";

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

export type FileContent = Record<string, any>;

export type FileRecord = Awaited<ReturnType[SYSTEM_CALL.loadFile]>;
