import { EncryptionProvider, MonetizationProvider } from "../../data-monetize";
import { FolderType, SignalType } from "../constants";
import { MirrorRecord } from "./mirror";

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

export type IndexFolderRecord = Record<string, IndexFolder>;

export interface ContentFolder {
  fsVersion: string;
  indexFolderId: string;
  mirrorFileIds: string[];
  encryptedFileKeys: string;
  reserved?: string;
}

export type ContentFolderRecord = Record<string, ContentFolder>;

export interface NativeFolder {
  indexFolderRecord: IndexFolderRecord;
  contentFolderRecord: ContentFolderRecord;
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
  mirrorRecord: MirrorRecord;
  mirrorRecordLocked?: boolean;
}

export type StructuredFolderRecord = Record<string, StructuredFolder>;
export type StructuredFolderRecordWithEncryptedFileKeys = Record<
  string,
  StructuredFolder & {
    encryptedFileKeys: string;
  }
>;

export interface FolderOptions {
  folderDescription?: string;
  signal?: Signal;
}

export type Signal = { type: SignalType; id: string };
