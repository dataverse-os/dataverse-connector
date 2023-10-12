import {
  DataTokenType,
  ChainId,
} from "@dataverse/dataverse-contracts-sdk/data-token";
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
  protocol: DataTokenType;
  chainId: ChainId;
  baseContract?: string;
  unionContract?: string;
  datatokenId?: string;
  dataUnionId?: string;
  dataUnionIds?: string[];
  unlockingTimeStamp?: string;
}

export interface AccessControl {
  encryptionProvider?: EncryptionProvider;
  monetizationProvider?: MonetizationProvider;
}

export type FileContent = Record<string, any>;

export type FileRecord = Awaited<ReturnType[SYSTEM_CALL.loadFile]>;
