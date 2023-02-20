import { CRYPTO_WALLET } from "../crypto-wallet";
import { AppsInfo } from "../dapp-verifier/types";
import { StreamObject, StreamsRecord } from "../data-models";
import {
  DecryptionConditions,
  DecryptionConditionsTypes,
} from "../data-monetize";
import { FileType, FolderType } from "../fs";
import {
  FileInfo,
  Mirror,
  Mirrors,
  StructuredFile,
  StructuredFiles,
  StructuredFolder,
  StructuredFolders,
} from "../fs/types";
import { Methods } from "./constants";

export interface RequestType {
  connectWallet: CRYPTO_WALLET;
  connectIdentity: {
    wallet: CRYPTO_WALLET;
    appName: string;
    modelNames?: string[];
  };
  getChainFromDID: string;
  createNewDID: CRYPTO_WALLET;
  switchDID: string;

  loadStream: string;
  loadStreamsByModel: {
    did: string;
    appName: string;
    modelName: string;
  };
  createStream: {
    did: string;
    appName: string;
    modelName: string;
    streamContent: any;
    fileType: FileType;
    encryptedSymmetricKey?: string;
    decryptionConditions?: any[];
    decryptionConditionsType?: DecryptionConditionsTypes;
  };
  updateStreams: {
    streamsRecord: Record<
      string,
      {
        streamContent?: any;
        fileType?: FileType;
        encryptedSymmetricKey?: string;
        decryptionConditions?: any[];
        decryptionConditionsType?: DecryptionConditionsTypes;
      }
    >;
    syncImmediately?: boolean;
  };

  getAllAppsInfoByDID: string;
  getModelIdByAppNameAndModelName: { appName: string; modelName: string };
  getAppNameAndModelNameByModelId: string;

  newLitKey: {
    did: string;
    appName: string;
    modelNames: string[];
    decryptionConditions: DecryptionConditions;
    decryptionConditionsType: DecryptionConditionsTypes;
  };
  getLitKey: {
    did: string;
    appName: string;
    modelNames: string[];
    encryptedSymmetricKey: string;
    decryptionConditions: DecryptionConditions;
    decryptionConditionsType: DecryptionConditionsTypes;
  };
  encryptWithLit: {
    did: string;
    appName: string;
    modelNames: string[];
    content: string;
    encryptedSymmetricKey: string;
    decryptionConditions: DecryptionConditions;
    decryptionConditionsType: DecryptionConditionsTypes;
  };
  decryptWithLit: {
    did?: string;
    appName?: string;
    modelNames?: string[];
    encryptedContent: string;
    symmetricKeyInBase16Format?: string;
    encryptedSymmetricKey?: string;
    decryptionConditions?: DecryptionConditions;
    decryptionConditionsType?: DecryptionConditionsTypes;
  };

  readFolders: { did: string; appName: string };
  readDefaultFolder: { did: string; appName: string };
  readFolderFiles: { did: string; appName: string; folderId: string };
  createFolder: {
    did: string;
    appName: string;
    folderType: FolderType;
    folderName: string;
    folderDescription?: string;
    mirrors?: Mirrors;
    curationId?: string;
    previews?: Mirrors;
  };
  changeFolderBaseInfo: {
    did: string;
    appName: string;
    folderId: string;
    newFolderName?: string;
    newFolderDescription?: string;
    syncImmediately?: boolean;
  };
  changeFolderType: {
    did: string;
    appName: string;
    folderId: string;
    targetFolderType: FolderType;
    folderDescription?: string;
    openMirrorIds?: string[];
    syncImmediately?: boolean;
  };
  deleteFolder: {
    did: string;
    appName: string;
    folderId: string;
    syncImmediately?: boolean;
  };
  updateFile: {
    did: string;
    appName: string;
    fileId: string;
    fileInfo: FileInfo;
    syncImmediately?: boolean;
  };
  addMirrors: {
    did: string;
    appName: string;
    modelNames?: string[];
    folderId: string;
    filesInfo?: (Omit<FileInfo, "fileType"> & { fileType: FileType })[];
    syncImmediately?: boolean;
  };
  updateMirror: {
    did: string;
    appName: string;
    modelNames?: string[];
    mirrorId: string;
    fileInfo: FileInfo;
    syncImmediately?: boolean;
  };
  moveMirrors: {
    did: string;
    appName: string;
    targetFolderId: string;
    sourceMirrorIds: string[];
    syncImmediately?: boolean;
  };
  removeMirrors: {
    did: string;
    appName: string;
    mirrorIds: string[];
    syncImmediately?: boolean;
  };
}

export interface ReturnType {
  connectWallet: Promise<string>;
  connectIdentity: Promise<string>;
  getChainFromDID: Promise<string>;
  createNewDID: Promise<{
    currentDid: string;
    createdDidList: string[];
  }>;
  switchDID: Promise<void>;

  loadStream: Promise<{
    did: string;
    appName?: string;
    modelName?: string;
    modelId: string;
    streamContent: any;
  }>;
  loadStreamsByModel: Promise<Record<string, any>>;
  createStream: Promise<StreamObject>;
  updateStreams: Promise<
    | {
        successRecord: StreamsRecord;
        failureRecord: StreamsRecord;
        failureReason?: StreamsRecord;
      }
    | undefined
  >;

  getAllAppsInfoByDID: Promise<AppsInfo>;
  getModelIdByAppNameAndModelName: Promise<string>;
  getAppNameAndModelNameByModelId: Promise<{
    appName: string;
    modelName: string;
  }>;

  newLitKey: Promise<{
    // symmetricKeyInBase16Format: string;
    encryptedSymmetricKey: string;
  }>;
  getLitKey: Promise<{ symmetricKeyInBase16Format: string }>;
  encryptWithLit: Promise<{ encryptedContent: string }>;
  decryptWithLit: Promise<{ content: string }>;

  readFolders: Promise<StructuredFolders>;
  readDefaultFolder: Promise<StructuredFolder>;
  readFolderFiles: Promise<Mirrors>;
  createFolder: Promise<{
    newFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  changeFolderBaseInfo: Promise<{
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
  updateFile: Promise<{
    currentFile: StructuredFile;
    allFiles: StructuredFiles;
  }>;
  addMirrors: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  updateMirror: Promise<{
    currentMirror: Mirror;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  moveMirrors: Promise<{
    sourceFolders: StructuredFolders;
    targetFolder: StructuredFolder;
    movedMirrors: Mirrors;
    allFolders: StructuredFolders;
  }>;
  removeMirrors: Promise<{
    sourceFolders: StructuredFolders;
    allFolders: StructuredFolders;
  }>;
}
export interface RequestInputs {
  method: Methods;
  params?: RequestType[Methods];
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
