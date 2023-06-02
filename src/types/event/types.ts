import { UploadProvider } from "..";
import { Mode } from "../constants";
import { CRYPTO_WALLET, Chain } from "../crypto-wallet";
import { AppsInfo, DAppInfo, DAppTable } from "../dapp-verifier/types";
import { StreamObject } from "../data-models";
import { StreamContent } from "../data-models/types";
import {
  CollectOutput,
  DatatokenMetadata,
  DatatokenVars,
  DecryptionConditions,
} from "../data-monetize/types";
import { FileType, FolderType } from "../fs";
import {
  FileInfo,
  MirrorFile,
  MirrorFiles,
  StructuredFolder,
  StructuredFolders,
} from "../fs/types";
import { Methods } from "./constants";

export interface RequestType {
  selectWallet: void;
  connectWallet: CRYPTO_WALLET;
  getCurrentWallet: void;
  switchNetwork: number;
  sign: {
    method: string;
    params: any[];
  };
  contractCall: {
    contractAddress: string;
    abi: any[];
    method: string;
    params: any[];
    mode?: Mode;
  };
  ethereumRequest: {
    method: string;
    params?: any;
  };
  createCapability: {
    wallet?: CRYPTO_WALLET;
    app?: string;
  };
  checkCapability: string | undefined;
  getChainFromPkh: string;
  getPkhList: void;
  getCurrentPkh: void;
  getWalletByPkh: string;
  createNewPkh: CRYPTO_WALLET;
  switchPkh: string;

  getDAppTable: void;
  getDAppInfo: string;
  getValidAppCaps: void;

  loadStream: { app: string; streamId: string };
  loadStreamsBy: {
    modelId: string;
    pkh?: string;
  };
  getModelBaseInfo: string;
  createStream: {
    modelId: string;
    streamContent: StreamContent;
  };
  updateStream: {
    app?: string;
    streamId: string;
    streamContent: StreamContent;
    syncImmediately?: boolean;
  };

  readFolders: string | undefined;
  createFolder: {
    app?: string;
    folderType: FolderType;
    folderName: string;
    folderDescription?: string;
  };
  updateFolderBaseInfo: {
    app?: string;
    folderId: string;
    newFolderName?: string;
    newFolderDescription?: string;
    syncImmediately?: boolean;
  };
  changeFolderType: {
    app?: string;
    folderId: string;
    targetFolderType: FolderType;
    syncImmediately?: boolean;
  };
  deleteFolder: {
    app?: string;
    folderId: string;
    syncImmediately?: boolean;
  };
  monetizeFolder: {
    app?: string;
    folderId: string;
    folderDescription: string;
    datatokenVars: Omit<DatatokenVars, "streamId">;
  };

  uploadFile: {
    app?: string;
    folderId: string;
    fileBase64: string;
    fileName: string;
    encrypted: boolean;
    uploadProvider: UploadProvider;
    syncImmediately?: boolean;
  };
  updateFileBaseInfo: {
    app?: string;
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
    app?: string;
    targetFolderId: string;
    sourceIndexFileIds: string[];
    syncImmediately?: boolean;
  };
  removeFiles: {
    app?: string;
    indexFileIds: string[];
    syncImmediately?: boolean;
  };
  monetizeFile: {
    app?: string;
    streamId?: string;
    indexFileId?: string;
    datatokenVars: Omit<DatatokenVars, "streamId">;
    decryptionConditions?: DecryptionConditions;
    uploadProvider?: UploadProvider;
  };

  createProfile: string;
  getProfiles: string;
  collect: {
    app?: string;
    streamId?: string;
    indexFileId?: string;
  };
  isCollected: { datatokenId: string; address: string };
  getDatatokenMetadata: string;
  unlock: { app?: string; streamId?: string; indexFileId?: string };
}

export interface ReturnType {
  selectWallet: Promise<CRYPTO_WALLET>;
  connectWallet: Promise<string>;
  getCurrentWallet: Promise<{
    wallet: CRYPTO_WALLET;
    address: string;
    chain: Chain;
  } | null>;
  switchNetwork: Promise<boolean>;
  sign: Promise<any>;
  contractCall: Promise<any>;
  ethereumRequest: Promise<any>;
  createCapability: Promise<string>;
  checkCapability: Promise<boolean>;
  getChainFromPkh: Promise<string>;
  getPkhList: Promise<string[]>;
  getCurrentPkh: Promise<string>;
  getWalletByPkh: Promise<CRYPTO_WALLET>;
  createNewPkh: Promise<{
    currentPkh: string;
    createdPkhList: string[];
  }>;
  switchPkh: Promise<boolean>;

  getDAppTable: Promise<DAppTable>;
  getDAppInfo: Promise<DAppInfo>;
  getValidAppCaps: Promise<AppsInfo>;
  getModelBaseInfo: Promise<StreamContent>;

  loadStream: Promise<{
    pkh: string;
    app?: string;
    modelId: string;
    streamContent: StreamContent;
  }>;
  loadStreamsBy: Promise<StreamContent>;
  createStream: Promise<
    StreamObject & { newFile?: MirrorFile; existingFile?: MirrorFile }
  >;
  updateStream: Promise<{
    streamContent: StreamContent;
    currentFile: MirrorFile;
  }>;

  readFolders: Promise<StructuredFolders>;
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
    isCurated: boolean;
    existingFile?: MirrorFile;
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
  removeFiles: Promise<{
    sourceFolders: StructuredFolders;
    removedFiles: MirrorFiles;
    allFolders: StructuredFolders;
  }>;
  monetizeFile: Promise<{
    streamContent?: StreamContent;
    currentFile: MirrorFile;
  }>;

  createProfile: Promise<string>;
  getProfiles: Promise<{ id: string }[]>;
  collect: Promise<
    CollectOutput &
      Partial<{
        newFile: MirrorFile;
        isCurated: boolean;
        currentFolder: StructuredFolder;
        allFolders: StructuredFolders;
      }>
  >;
  isCollected: Promise<boolean>;
  getDatatokenMetadata: Promise<DatatokenMetadata>;
  unlock: Promise<MirrorFile>;
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
