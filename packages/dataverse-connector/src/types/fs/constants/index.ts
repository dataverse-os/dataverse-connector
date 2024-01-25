export enum FolderType {
  PublicFolderType,
  PrivateFolderType,
  UnionFolderType
}

export enum FileType {
  PublicFileType,
  PrivateFileType,
  PayableFileType
}

export enum SignalType {
  schema,
  action,
  asset
}

export enum StorageResource {
  CERAMIC = "CERAMIC",
  WEAVEDB = "WEAVEDB",
  IPFS = "IPFS"
}

export enum ActionType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  CLICK = "CLICK",
  COLLECT = "COLLECT",
  UNLOCK = "UNLOCK",
  RECEIVE = "RECEIVE"
}

export const TEMP = "temp";

export const fsVersion = "0.11";
