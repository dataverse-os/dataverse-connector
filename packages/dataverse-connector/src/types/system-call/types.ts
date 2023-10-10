import { StorageProvider } from "../types";
import { ValidAppCaps } from "../app/types";
import { DatatokenVars, DecryptionConditions } from "../data-monetize/types";
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

  loadFolderTrees: void;
  loadFolderById: string;
  createFolder: {
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

  loadDataUnions: void;
  publishDataUnion: {
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

  createIndexFile: {
    modelId: string;
    fileName?: string;
    fileContent: FileContent;
  };
  updateIndexFile: {
    fileId: string;
    fileName?: string;
    fileContent?: FileContent;
    syncImmediately?: boolean;
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
    encrypted?: boolean;
    previewed?: boolean;
    storageProvider: StorageProvider;
    dataUnionId?: string;
    datatokenVars?: Omit<DatatokenVars, "streamId">;
    unlockingTimeStamp?: string;
    decryptionConditions?: DecryptionConditions;
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

  removeFiles: {
    fileIds: string[];
    syncImmediately?: boolean;
  };

  loadFile: string;
  loadFilesBy: {
    modelId: string;
    pkh?: string;
  };
  loadBareFileContent: string;

  monetizeFile: {
    fileId: string;
    datatokenVars?: DatatokenVars;
    unlockingTimeStamp?: string;
    dataUnionId?: string;
    decryptionConditions?: DecryptionConditions;
  };
  collectFile: string;
  collectDataUnion: string;
  unlockFile: string;
  checkIsDataTokenCollectedByAddress: { datatokenId: string; address: string };
  getDatatokenBaseInfo: string;
}

export interface ReturnType {
  getPKP: Promise<{ address: string; publicKey: string }>;
  executeLitAction: Promise<any>;

  getValidAppCaps: Promise<ValidAppCaps>;
  getModelBaseInfo: Promise<any>;

  createCapability: Promise<string>;
  checkCapability: Promise<boolean>;

  loadFolderTrees: Promise<StructuredFolderRecord>;
  loadFolderById: Promise<StructuredFolder>;
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

  loadDataUnions: Promise<StructuredFolderRecord>;
  publishDataUnion: Promise<{
    newDataUnion: StructuredFolder;
    allDataUnions: StructuredFolderRecord;
  }>;
  deleteDataUnion: Promise<{
    currentDataUnion: StructuredFolder;
    allDataUnions: StructuredFolderRecord;
  }>;

  createIndexFile: Promise<{
    pkh: string;
    appId: string;
    modelId: string;
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent;
    };
  }>;
  updateIndexFile: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent;
    };
  }>;

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

  removeFiles: Promise<{
    sourceFolders: StructuredFolderRecord;
    removedFiles: MirrorFileRecord;
    allFolders: StructuredFolderRecord;
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
  loadBareFileContent: Promise<string>;

  monetizeFile: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent | string;
    };
  }>;
  collectFile: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent | string;
    };
  }>;
  collectDataUnion: Promise<StructuredFolder>;
  unlockFile: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent | string;
    };
  }>;
  checkIsDataTokenCollectedByAddress: Promise<boolean>;
  getDatatokenBaseInfo: Promise<any>;
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
