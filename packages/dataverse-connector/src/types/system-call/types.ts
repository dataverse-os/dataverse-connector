import { Cacao } from "ceramic-cacao";
import { DagJWS } from "dids";
import { StorageProvider } from "..";
import { ValidAppCaps } from "../app";
import {
  Action,
  FileContent,
  MirrorFile,
  MirrorFileRecord,
  StructuredFolder,
  StructuredFolderRecord,
  Signal,
  FolderType
} from "../fs";
import { SYSTEM_CALL } from "./constants";
import { RESOURCE } from "../wallet";
import { EncryptionProvider, MonetizationProvider } from "../data-monetize";

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
  getAppSessionKey: void;
  getAppCacao: void;
  signWithSessionKey: string | object;

  generateFileKey: void;
  encryptContent: { content: object; keyHandler: string };

  createFolder: {
    folderName: string;
    folderType?: FolderType;
    folderDescription?: string;
    signals?: Signal[];
  };
  updateFolderBaseInfo: {
    folderId: string;
    folderName?: string;
    folderDescription?: string;
    syncImmediately?: boolean;
  };
  loadFolderTrees: void;
  loadFoldersBy: { folderIds?: string[]; signal?: Signal };
  deleteFolder: {
    folderId: string;
    syncImmediately?: boolean;
  };

  monetizeFolder: {
    folderId: string;
    monetizationProvider: MonetizationProvider;
  };
  updateDataUnionBaseInfo: {
    dataUnionId: string;
    dataUnionName: string;
    dataUnionDescription?: string;
    syncImmediately?: boolean;
  };
  loadDataUnionById: string;
  deleteDataUnion: {
    dataUnionId: string;
    syncImmediately?: boolean;
  };

  createIndexFile: {
    modelId: string;
    fileName?: string;
    fileContent: FileContent;
    folderId?: string;
    encryptedContent?: object;
    keyHandler?: string;
  };
  updateIndexFile: {
    fileId: string;
    fileName?: string;
    fileContent?: FileContent;
    encryptedContent?: object;
    keyHandler?: string;
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
    storageProvider: StorageProvider;
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
    modelId?: string;
    pkh?: string;
    fileIds?: string[];
  };
  loadBareFileContent: string;
  loadActionFilesByFileId: string;
  loadActionFilesByDataUnionId: string;

  monetizeFile: {
    fileId: string;
    monetizationProvider: MonetizationProvider;
    encryptionProvider?: EncryptionProvider;
  };
  unlockFile: string;
  isFileUnlocked: string;
}

export interface ReturnType {
  getPKP: Promise<{ address: string; publicKey: string }>;
  executeLitAction: Promise<any>;

  getValidAppCaps: Promise<ValidAppCaps>;
  getModelBaseInfo: Promise<any>;

  createCapability: Promise<{ pkh: string; cacao: Cacao }>;
  checkCapability: Promise<boolean>;
  getAppSessionKey: Promise<string>;
  getAppCacao: Promise<Cacao>;
  signWithSessionKey: Promise<{ jws: DagJWS; cacao: Cacao }>;

  generateFileKey: Promise<string>;
  encryptContent: Promise<object>;

  createFolder: Promise<{
    newFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  updateFolderBaseInfo: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  loadFolderTrees: Promise<StructuredFolderRecord>;
  loadFoldersBy: Promise<StructuredFolderRecord>;
  deleteFolder: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;

  monetizeFolder: Promise<{
    newDataUnion: StructuredFolder;
    allDataUnions: StructuredFolderRecord;
  }>;
  updateDataUnionBaseInfo: Promise<{
    currentDataUnion: StructuredFolder;
    allDataUnions: StructuredFolderRecord;
  }>;
  loadCreatedDataUnions: Promise<StructuredFolderRecord>;
  loadCollectedDataUnions: Promise<StructuredFolderRecord>;
  loadDataUnionById: Promise<StructuredFolder>;
  deleteDataUnion: Promise<{
    currentDataUnion: StructuredFolder;
    allDataUnions: StructuredFolderRecord;
  }>;

  createIndexFile: Promise<{
    pkh: string;
    appId: string;
    modelId: string;
    fileContent: {
      file: Omit<MirrorFile, "content" | "external">;
      content: FileContent;
    };
  }>;
  updateIndexFile: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "content" | "external">;
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
    fileContent: {
      file?: Omit<MirrorFile, "content" | "external">;
      content?: FileContent;
    };
  }>;
  loadFilesBy: Promise<
    Record<
      string,
      {
        appId: string;
        modelId: string;
        pkh: string;
        fileContent: {
          file?: Omit<MirrorFile, "content" | "external">;
          content?: FileContent;
        };
      }
    >
  >;
  loadBareFileContent: Promise<string>;
  loadActionFilesByFileId: Promise<MirrorFileRecord>;
  loadActionFilesByDataUnionId: Promise<MirrorFileRecord>;
  loadCreatedDatatokenFiles: Promise<MirrorFileRecord>;
  loadCollectedDatatokenFiles: Promise<MirrorFileRecord>;

  monetizeFile: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "content" | "external">;
      content?: FileContent;
    };
  }>;
  unlockFile: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "content" | "external">;
      content?: FileContent;
    };
  }>;
  isFileUnlocked: Promise<boolean>;
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
