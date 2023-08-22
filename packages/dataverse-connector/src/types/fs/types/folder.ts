import { FolderType } from "../constants";
import { EncryptionProvider, MonetizationProvider } from "./common";
import { Mirrors } from "./mirrors";

export interface IndexFolder {
  fsVersion: string;
  folderName: string;
  folderType: FolderType;
  contentFolderIds: string[];
  accessControl?: string;
  parentFolderId?: string;
  childFolderIds?: string[];
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
  options?: string;
  reserved?: string;
}

export type IndexFoldersRecord = Record<string, IndexFolder>;

export interface ContentFolder {
  fsVersion: string;
  indexFolderId: string;
  mirrorFileIds: string[];
  encryptedFileKeys: string;
  reserved?: string;
}

export type ContentFoldersRecord = Record<string, ContentFolder>;

export interface NativeFolders {
  indexFolders: IndexFoldersRecord;
  contentFolders: ContentFoldersRecord;
}

export interface StructuredFolder {
  appId?: string;
  controller?: string;
  model: [string, string];
  fsVersion: string;
  folderId: string;
  contentFolderIds: string[];
  folderName: string;
  folderType: FolderType;
  accessControl?: {
    encryptionProvider?: EncryptionProvider;
    monetizationProvider?: MonetizationProvider;
  };
  parentFolderId?: string;
  childFolderIds?: string[];
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
  options?: FolderOptions;
  reserved?: any;
  mirrors: Mirrors;
  mirrorsLocked?: boolean;
}

export type StructuredFolders = Record<string, StructuredFolder>;
export type StructuredFoldersWithEncryptedFileKeys = Record<
  string,
  StructuredFolder & {
    encryptedFileKeys: string;
  }
>;

export interface FolderOptions {
  folderDescription?: string;
}
