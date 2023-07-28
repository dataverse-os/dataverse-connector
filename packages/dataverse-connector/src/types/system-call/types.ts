import { StorageProvider } from "../types";
import { ValidAppCaps } from "../app/types";
import { StreamContent } from "../app";
import { DatatokenVars, DecryptionConditions } from "../data-monetize/types";
import { FolderType } from "../fs";
import {
  FileInfo,
  MirrorFile,
  MirrorFiles,
  StructuredFolder,
  StructuredFolders,
} from "../fs/types";
import { SYSTEM_CALL } from "./constants";
import { RESOURCE } from "../wallet";

export interface RequestType {
  handshake: void;

  getPKP: void;
  executeLitAction: { code: string; jsParams: object };

  getValidAppCaps: void;
  getModelBaseInfo: string;

  createCapability: {
    appId: string;
    resource?: RESOURCE;
  };
  checkCapability: {
    appId: string;
    resource?: RESOURCE;
  };
  loadStream: string;
  loadStreamsBy: {
    modelId: string;
    pkh?: string;
  };
  createStream: {
    modelId: string;
    streamContent: StreamContent;
  };
  updateStream: {
    streamId: string;
    streamContent: StreamContent;
    syncImmediately?: boolean;
  };

  readFolders: void;
  readFolderById: string;
  createFolder: {
    folderType: FolderType;
    folderName: string;
    folderDescription?: string;
  };
  updateFolderBaseInfo: {
    folderId: string;
    newFolderName?: string;
    newFolderDescription?: string;
    syncImmediately?: boolean;
  };
  changeFolderType: {
    folderId: string;
    targetFolderType: FolderType;
    syncImmediately?: boolean;
  };
  deleteFolder: {
    folderId: string;
    syncImmediately?: boolean;
  };
  monetizeFolder: {
    folderId: string;
    folderDescription: string;
    datatokenVars: Omit<DatatokenVars, "streamId">;
  };

  uploadFile: {
    folderId?: string;
    fileBase64: string;
    fileName: string;
    encrypted: boolean;
    storageProvider: StorageProvider;
  };
  updateFileBaseInfo: {
    indexFileId: string;
    fileInfo?: Omit<
      FileInfo,
      | "datatokenId"
      | "fileKey"
      | "encryptedSymmetricKey"
      | "decryptionConditions"
      | "decryptionConditionsType"
    >;
    syncImmediately?: boolean;
  };
  moveFiles: {
    targetFolderId: string;
    sourceIndexFileIds: string[];
    syncImmediately?: boolean;
  };
  monetizeFile: {
    streamId?: string;
    indexFileId?: string;
    datatokenVars: Omit<DatatokenVars, "streamId">;
    decryptionConditions?: DecryptionConditions;
  };
  removeFiles: {
    indexFileIds: string[];
    syncImmediately?: boolean;
  };

  unlock: { streamId?: string; indexFileId?: string };
}

export interface ReturnType {
  handshake: Promise<string>;

  getPKP: Promise<{ address: string; publicKey: string }>;
  executeLitAction: Promise<any>;

  getValidAppCaps: Promise<ValidAppCaps>;
  getModelBaseInfo: Promise<StreamContent>;

  createCapability: Promise<string>;
  checkCapability: Promise<boolean>;
  loadStream: Promise<{
    pkh: string;
    appId: string;
    modelId: string;
    streamContent:
      | {
          file?: Omit<MirrorFile, "fileKey" | "content">;
          content?: StreamContent;
        }
      | StreamContent;
  }>;
  loadStreamsBy: Promise<
    Record<
      string,
      {
        appId: string;
        modelId: string;
        pkh: string;
        streamContent:
          | {
              file?: Omit<MirrorFile, "fileKey" | "content">;
              content?: StreamContent;
            }
          | StreamContent;
      }
    >
  >;
  createStream: Promise<{
    pkh: string;
    appId: string;
    modelId: string;
    streamId: string;
    streamContent: {
      file: Omit<MirrorFile, "fileKey" | "content">;
      content: StreamContent;
    };
  }>;
  updateStream: Promise<{
    streamContent: {
      file: Omit<MirrorFile, "fileKey" | "content">;
      content: StreamContent;
    };
  }>;

  readFolders: Promise<StructuredFolders>;
  readFolderById: Promise<StructuredFolder>;
  createFolder: Promise<{
    newFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  updateFolderBaseInfo: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  changeFolderType: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  deleteFolder: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  monetizeFolder: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;

  uploadFile: Promise<{
    newFile: MirrorFile;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  updateFileBaseInfo: Promise<{
    currentFile: MirrorFile;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  moveFiles: Promise<{
    sourceFolders: StructuredFolders;
    targetFolder: StructuredFolder;
    movedFiles: MirrorFiles;
    allFolders: StructuredFolders;
  }>;
  monetizeFile: Promise<{
    streamContent: {
      file: Omit<MirrorFile, "fileKey" | "content">;
      content: StreamContent | string;
    };
  }>;
  removeFiles: Promise<{
    sourceFolders: StructuredFolders;
    removedFiles: MirrorFiles;
    allFolders: StructuredFolders;
  }>;

  unlock: Promise<{
    streamContent: {
      file: Omit<MirrorFile, "fileKey" | "content">;
      content: StreamContent | string;
    };
  }>;
}

export interface RequestInputs {
  method: SYSTEM_CALL;
  params?: RequestType[SYSTEM_CALL];
}

export interface RequestArguments {
  sequenceId: number;
  type: "request";
}

export interface ResponseArguments {
  sequenceId: number;
  type: "response";
  result: object;
}

export interface EventInput {
  method: string;
  params?: any;
}

export interface EventArguments {
  type: "request";
}
