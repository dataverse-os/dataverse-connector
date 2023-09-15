import { StorageProvider } from "../types";
import { ValidAppCaps } from "../app/types";
import { DatatokenVars, DecryptionConditions } from "../data-monetize/types";
import { FolderType } from "../fs";
import {
  Action,
  ActionType,
  ContentType,
  FileContent,
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

  readDataUnions: void;
  createDataUnion: {
    dataUnionName: string;
    dataUnionDescription?: string;
    contentType?: ContentType;
    actionType?: ActionType;
    dataUnionVars: Omit<DatatokenVars, "streamId">;
  };
  deleteDataUnion: {
    dataUnionId: string;
    syncImmediately?: boolean;
  };

  createFile: {
    modelId: string;
    fileName?: string;
    fileContent: FileContent;
  };
  updateFile: {
    fileId: string;
    fileName?: string;
    fileContent?: FileContent;
    syncImmediately?: boolean;
  };
  loadFile: string;
  loadFilesBy: {
    modelId: string;
    pkh?: string;
  };
  createActionFile: {
    folderId?: string;
    action: Action;
    relationId: string;
    fileName?: string;
  };
  updateActionFile: {
    fileId: string;
    fileName?: string;
    isRelationIdEncrypted?: boolean;
    isCommentEncrypted?: boolean;
    syncImmediately?: boolean;
  };
  createBareFile: {
    folderId?: string;
    fileBase64: string;
    fileName: string;
    encrypted: boolean;
    storageProvider: StorageProvider;
    isDatatoken?: boolean;
    dataUnionId?: string;
    datatokenVars?: Omit<DatatokenVars, "streamId">;
    unlockingTimeStamp?: string;
  };
  updateBareFile: {
    fileId: string;
    fileBase64?: string;
    fileName?: string;
    encrypted?: boolean;
    storageProvider?: StorageProvider;
    syncImmediately?: boolean;
  };
  moveFiles: {
    targetFolderId: string;
    fileIds: string[];
    syncImmediately?: boolean;
  };
  monetizeFile: {
    fileId: string;
    datatokenVars: DatatokenVars;
    unlockingTimeStamp?: string;
    dataUnionId?: string;
    decryptionConditions?: DecryptionConditions;
  };
  removeFiles: {
    fileIds: string[];
    syncImmediately?: boolean;
  };

  collect: string;
  unlock: string;
}

export interface ReturnType {
  getPKP: Promise<{ address: string; publicKey: string }>;
  executeLitAction: Promise<any>;

  getValidAppCaps: Promise<ValidAppCaps>;
  getModelBaseInfo: Promise<any>;

  createCapability: Promise<string>;
  checkCapability: Promise<boolean>;

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

  readDataUnions: Promise<StructuredFolderRecord>;
  createDataUnion: Promise<{
    newDataUnion: StructuredFolder;
    allDataUnions: StructuredFolderRecord;
  }>;
  deleteDataUnion: Promise<{
    currentDataUnion: StructuredFolder;
    allDataUnions: StructuredFolderRecord;
  }>;

  createFile: Promise<{
    pkh: string;
    appId: string;
    modelId: string;
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent;
    };
  }>;
  updateFile: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent;
    };
  }>;
  loadFile: Promise<{
    pkh: string;
    appId: string;
    modelId: string;
    fileContent:
      | {
          file?: Omit<MirrorFile, "fileKey" | "content" | "external">;
          content?: FileContent;
        }
      | FileContent;
  }>;
  loadFilesBy: Promise<
    Record<
      string,
      {
        appId: string;
        modelId: string;
        pkh: string;
        fileContent:
          | {
              file?: Omit<MirrorFile, "fileKey" | "content" | "external">;
              content?: FileContent;
            }
          | FileContent;
      }
    >
  >;
  createActionFile: Promise<{
    newFile: MirrorFile;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  updateActionFile: Promise<{
    currentFile: MirrorFile;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  createBareFile: Promise<{
    newFile: MirrorFile;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  updateBareFile: Promise<{
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
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent | string;
    };
  }>;
  removeFiles: Promise<{
    sourceFolders: StructuredFolderRecord;
    removedFiles: MirrorFileRecord;
    allFolders: StructuredFolderRecord;
  }>;

  collect: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent | string;
    };
  }>;
  unlock: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent | string;
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
