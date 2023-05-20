import { CRYPTO_WALLET } from "../crypto-wallet";
import { ApplicationRegistry, AppsInfo } from "../dapp-verifier/types";
import { StreamObject, StreamsRecord } from "../data-models";
import {
  DecryptionConditions,
  DecryptionConditionsTypes,
} from "../data-monetize";
import {
  CollectOutput,
  CreateDatatokenOutPut,
  CreateProfileOutput,
  DatatokenMetadata,
  DatatokenVars,
} from "../data-monetize/types";
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
  switchNetwork: number;
  ethereumRequest: {
    method: string;
    params?: any;
  };
  contractCall: {
    contractAddress: string;
    abi: any[];
    method: string;
    params: any[];
  };
  signerSign: {
    method: string;
    params: any[];
  };
  connectIdentity: {
    wallet: CRYPTO_WALLET;
    appName: string;
    modelNames?: string[];
  };
  checkIsCurrentDIDValid: {
    appName: string;
    modelNames?: string[];
  };
  getChainFromDID: string;
  getDIDList: void;
  getCurrentDID: void;
  createNewDID: CRYPTO_WALLET;
  switchDID: string;

  loadStream: { appName: string; streamId: string };
  loadStreamsByModel: {
    appName: string;
    modelName: string;
  };
  loadStreamsByModelAndDID: {
    did: string;
    appName: string;
    modelName: string;
  };
  getModelBaseInfo: string;
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
    appName: string;
    streamsRecord: Record<
      string,
      {
        streamContent?: any;
        fileType?: FileType;
        datatokenId?: string;
        contentId?: string;
        encryptedSymmetricKey?: string;
        decryptionConditions?: any[];
        decryptionConditionsType?: DecryptionConditionsTypes;
      }
    >;
    syncImmediately?: boolean;
  };

  getAllAppsNames: void;
  getAllAppsBaseInfo: void;
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
    syncImmediately?: boolean;
  };
  deleteFolder: {
    did: string;
    appName: string;
    folderId: string;
    syncImmediately?: boolean;
  };
  monetizeFolder: {
    did: string;
    appName: string;
    folderId: string;
    folderDescription?: string;
    datatokenVars: DatatokenVars;
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
    folderId: string;
    filesInfo?: (Omit<FileInfo, "fileType"> & {
      fileType: FileType;
    })[];
    syncImmediately?: boolean;
  };
  updateMirror: {
    did: string;
    appName: string;
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
  monetizeMirror: {
    did: string;
    appName: string;
    mirrorId: string;
    datatokenVars: DatatokenVars;
  };

  getChainOfDatatoken: void;
  createLensProfile: string;
  getLensProfiles: string;
  createDatatoken: DatatokenVars;
  collect: {
    did: string;
    appName: string;
    indexFileId: string;
  };
  isCollected: { datatokenId: string; address: string };
  getDatatokenMetadata: string;
  unlock: {
    did: string;
    appName: string;
    indexFileId: string;
  };

  migrateOldFolders: string;
}

export interface ReturnType {
  connectWallet: Promise<string>;
  switchNetwork: Promise<boolean>;
  ethereumRequest: Promise<any>;
  signerSign: Promise<any>;
  contractCall: Promise<any>;
  connectIdentity: Promise<string>;
  checkIsCurrentDIDValid: Promise<boolean>;
  getChainFromDID: Promise<string>;
  getDIDList: Promise<string[]>;
  getCurrentDID: Promise<string>;
  createNewDID: Promise<{
    currentDID: string;
    createdDIDList: string[];
  }>;
  switchDID: Promise<boolean>;

  loadStream: Promise<{
    did: string;
    appName?: string;
    modelName?: string;
    modelId: string;
    streamContent: any;
  }>;
  loadStreamsByModel: Promise<Record<string, any>>;
  loadStreamsByModelAndDID: Promise<Record<string, any>>;
  getModelBaseInfo: Promise<Record<string, any>>;
  createStream: Promise<
    StreamObject & { newMirror?: Mirror; existingMirror?: Mirror }
  >;
  updateStreams: Promise<
    | {
        successRecord: StreamsRecord;
        failureRecord: StreamsRecord;
        failureReason?: StreamsRecord;
      }
    | undefined
  >;

  getAllAppsNames: Promise<string[]>;
  getAllAppsBaseInfo: Promise<ApplicationRegistry>;
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
  monetizeFolder: Promise<{
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;

  updateFile: Promise<{
    currentFile: StructuredFile;
    allFiles: StructuredFiles;
  }>;

  addMirrors: Promise<{
    newMirrors: Mirrors;
    isCurated: boolean;
    existingMirror?: Mirror;
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
    removedMirrors: Mirrors;
    allFolders: StructuredFolders;
  }>;
  monetizeMirror: Promise<{
    currentMirror: Mirror;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;

  getChainOfDatatoken: Promise<string>;
  createLensProfile: Promise<string>;
  getLensProfiles: Promise<{ id: string }[]>;
  createDatatoken: Promise<CreateDatatokenOutPut>;
  collect: Promise<
    CollectOutput & {
      newMirrors: Mirrors;
      isCurated: boolean;
      currentFolder: StructuredFolder;
      allFolders: StructuredFolders;
    }
  >;
  isCollected: Promise<boolean>;
  getDatatokenMetadata: Promise<DatatokenMetadata>;
  unlock: Promise<object>;

  migrateOldFolders: Promise<boolean>;
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
