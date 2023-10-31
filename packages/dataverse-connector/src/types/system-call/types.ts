import { StorageProvider } from "..";
import { ValidAppCaps } from "../app";
import {
  DataUnionVars,
  DatatokenVars,
  DecryptionConditions,
  DataTokenGraphType,
  Datatoken_Collector,
  DataUnionGraphType,
  Data_Union_Subscriber,
  SubscribeDataUnionVars,
  SubscribeDataUnionOutput,
} from "../data-monetize";
import {
  Action,
  ActionType,
  ContentType,
  FileContent,
  MirrorFile,
  MirrorFileRecord,
  StructuredFolder,
  StructuredFolderRecord,
} from "../fs";
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

  createFolder: {
    folderName: string;
    folderDescription?: string;
  };
  updateFolderBaseInfo: {
    folderId: string;
    folderName?: string;
    folderDescription?: string;
    syncImmediately?: boolean;
  };
  loadFolderTrees: void;
  loadFolderById: string;
  deleteFolder: {
    folderId: string;
    syncImmediately?: boolean;
  };

  publishDataUnion: {
    dataUnionName: string;
    dataUnionDescription?: string;
    contentType?: ContentType;
    actionType?: ActionType;
    dataUnionVars: DataUnionVars;
  };
  updateDataUnionBaseInfo: {
    dataUnionId: string;
    dataUnionName: string;
    dataUnionDescription?: string;
    syncImmediately?: boolean;
  };
  loadCreatedDataUnions: void;
  loadCollectedDataUnions: void;
  loadDataUnionById: string;
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
    datatokenVars?: DatatokenVars;
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
  loadCreatedDatatokenFiles: void;
  loadCollectedDatatokenFiles: void;

  monetizeFile: {
    fileId: string;
    datatokenVars?: DatatokenVars;
    unlockingTimeStamp?: string;
    dataUnionId?: string;
    decryptionConditions?: DecryptionConditions;
  };
  collectFile: string;
  collectDataUnion: string;
  subscribeDataUnion: SubscribeDataUnionVars;
  unlockFile: string;

  loadDatatokensCreatedBy: string;
  loadDatatokensCollectedBy: string;
  loadDatatoken: string;
  loadDatatokens: Array<string>;
  loadDatatokenCollectors: string;
  isDatatokenCollectedBy: { datatokenId: string; collector: string };

  loadDataUnionsPublishedBy: string;
  loadDataUnionsCollectedBy: string;
  loadDataUnion: string;
  loadDataUnionCollectors: string;
  loadDataUnionSubscribers: string;
  loadDataUnionSubscriptionsBy: {
    dataUnionId: string;
    collector: string;
  };
  isDataUnionCollectedBy: {
    dataUnionId: string;
    collector: string;
  };
  isDataUnionSubscribedBy: {
    dataUnionId: string;
    subscriber: string;
    blockNumber?: number;
    timestamp?: number;
  };
}

export interface ReturnType {
  getPKP: Promise<{ address: string; publicKey: string }>;
  executeLitAction: Promise<any>;

  getValidAppCaps: Promise<ValidAppCaps>;
  getModelBaseInfo: Promise<any>;

  createCapability: Promise<string>;
  checkCapability: Promise<boolean>;

  createFolder: Promise<{
    newFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  updateFolderBaseInfo: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;
  loadFolderTrees: Promise<StructuredFolderRecord>;
  loadFolderById: Promise<StructuredFolder>;
  deleteFolder: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolderRecord;
  }>;

  publishDataUnion: Promise<{
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
  loadCreatedDatatokenFiles: Promise<MirrorFileRecord>;
  loadCollectedDatatokenFiles: Promise<MirrorFileRecord>;

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
  subscribeDataUnion: Promise<SubscribeDataUnionOutput>;
  unlockFile: Promise<{
    fileContent: {
      file: Omit<MirrorFile, "fileKey" | "content" | "external">;
      content: FileContent | string;
    };
  }>;

  loadDatatokensCreatedBy: Promise<Array<DataTokenGraphType>>;
  loadDatatokensCollectedBy: Promise<Array<DataTokenGraphType>>;
  loadDatatoken: Promise<DataTokenGraphType>;
  loadDatatokens: Promise<Array<DataTokenGraphType>>;
  loadDatatokenCollectors: Promise<Array<Datatoken_Collector>>;
  isDatatokenCollectedBy: Promise<boolean>;

  loadDataUnionsPublishedBy: Promise<Array<DataUnionGraphType>>;
  loadDataUnionsCollectedBy: Promise<Array<DataUnionGraphType>>;
  loadDataUnion: Promise<DataUnionGraphType>;
  loadDataUnionCollectors: Promise<Array<Data_Union_Subscriber>>;
  loadDataUnionSubscribers: Promise<Array<Data_Union_Subscriber>>;
  loadDataUnionSubscriptionsBy: Promise<Array<Data_Union_Subscriber>>;
  isDataUnionCollectedBy: Promise<boolean>;
  isDataUnionSubscribedBy: Promise<boolean>;
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
