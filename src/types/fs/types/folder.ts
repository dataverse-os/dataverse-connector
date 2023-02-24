export interface IndexFolder {
  appVersion: string;
  folderType: number;
  contentFolderIds: string[];
  createdAt: string;
  updatedAt: string;
  options: string;
  parentFolderId?: string;
  childFolderIds?: string[];
  deleted?: boolean;
}

export interface ContentFolder {
  indexFolderId: string;
  mirrors: string;
}

export type IndexFoldersRecord = Record<string, IndexFolder>;
export type ContentFoldersRecord = Record<string, ContentFolder>;

export interface NativeFolders {
  indexFolders: IndexFoldersRecord;
  contentFolders: ContentFoldersRecord;
}

import { FolderType } from "../constants/folders";
import { Mirrors } from "./mirrors";

export interface CommonFolderOptions {
  folderName: string;
  folderDescription?: string;
}

export interface PublicFolderOptions extends CommonFolderOptions {}

export interface PrivateFolderOptions extends CommonFolderOptions {
  encryptedSymmetricKey: string;
  decryptionConditions: string;
  chain: string;

  encrypted: string;
}

export interface DatatokenFolderOptions extends CommonFolderOptions {
  curationId: string;

  encryptedSymmetricKey: string;
  decryptionConditions: string;
  chain: string;

  previews: string | Mirrors;
  lockedNum: number;
}

export type FolderOptions =
  | PublicFolderOptions
  | PrivateFolderOptions
  | DatatokenFolderOptions;

export interface StructuredFolder {
  /** the ceramic indexFolder & contentFolder models of the folder */
  model: [string, string];
  /** the ceramic indexFolder streamID of the folder */
  folderId: string;
  contentFolderIds?: string[];

  /** the type of the folder, see {@link FolderType} */
  folderType: FolderType;

  /** the creation datetime of the folder */
  createdAt: string;
  /** the updation datetime of the folder */
  updatedAt: string;

  options: FolderOptions;

  /** the ceramic parent folder streamID of the folder */
  parentFolderId?: string;
  childFolderIds?: string[];

  mirrors: string | Mirrors;
  mirrorsLocked?: boolean;
  deleted?: boolean;
}

export type StructuredFolders = Record<string, StructuredFolder>;
