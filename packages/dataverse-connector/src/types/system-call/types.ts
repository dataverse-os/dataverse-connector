import { StorageProvider } from "../types";
import { ValidAppCaps } from "../app/types";
import { StreamContent } from "../app";
import { DatatokenVars, DecryptionConditions } from "../data-monetize/types";
import { FolderType } from "../fs";
import {
  FileInfo,
  MirrorFile,
  MirrorFileRecord,
  StructuredFolder,
  StructuredFolderRecord,
} from "../fs/types";
import { SYSTEM_CALL } from "./constants";
import { RESOURCE } from "../wallet";

export interface RequestType {
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
  deleteFolder: {
    folderId: string;
    syncImmediately?: boolean;
  };

  uploadFile: {
    folderId?: string;
    fileBase64: string;
    fileName: string;
    encrypted: boolean;
    storageProvider: StorageProvider;
  };
  updateFileBaseInfo: {
    fileId: string;
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
    fileIds: string[];
    syncImmediately?: boolean;
  };
  monetizeFile: {
    streamId?: string;
    fileId?: string;
    datatokenVars: Omit<DatatokenVars, "streamId">;
    decryptionConditions?: DecryptionConditions;
  };
  removeFiles: {
    fileIds: string[];
    syncImmediately?: boolean;
  };

  unlock: { streamId?: string; fileId?: string };
}

export interface ReturnType {
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

  readFolders: Promise<StructuredFolderRecord>;
  readFolderById: Promise<StructuredFolder>;
  createFolder: Promise<{
    newFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  updateFolderBaseInfo: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  deleteFolder: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;

  uploadFile: Promise<{
    newFile: MirrorFile;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  updateFileBaseInfo: Promise<{
    currentFile: MirrorFile;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  moveFiles: Promise<{
    sourceFolders: StructuredFolderRecord;
    targetFolder: StructuredFolder;
    movedFiles: MirrorFileRecord;
    allFolders: StructuredFolderRecord;
  }>;
  monetizeFile: Promise<{
    streamContent: {
      file: Omit<MirrorFile, "fileKey" | "content">;
      content: StreamContent | string;
    };
  }>;
  removeFiles: Promise<{
    sourceFolders: StructuredFolderRecord;
    removedFiles: MirrorFileRecord;
    allFolders: StructuredFolderRecord;
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
