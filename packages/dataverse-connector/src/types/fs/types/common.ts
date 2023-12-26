import { ReturnType, SYSTEM_CALL } from "../../system-call";

export {
  EncryptionProtocol,
  type EncryptionProvider,
  type MonetizationProvider,
  type AccessControl
} from "@dataverse/monetization-template";

export type FileContent = Record<string, any>;

export type FileRecord = Awaited<ReturnType[SYSTEM_CALL.loadFile]>;
