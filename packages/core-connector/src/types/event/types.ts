import { Signer as EthersSigner, providers } from "ethers";
import { StorageProvider } from "../types";
import { SignMethod } from "../constants";
import { Chain, WALLET } from "../crypto-wallet";
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
import { RESOURCE } from "../identity/constants";
import { WalletProvider } from "@dataverse/wallet-provider";

export interface RequestType {
  connectWallet?: {
    wallet?: WALLET | undefined;
    isDataverseProvider?: boolean;
  };
  switchNetwork: number;
  sign: {
    method: SignMethod;
    params: any[];
  };
  contractCall: {
    contractAddress: string;
    abi: any[];
    method: string;
    params: any[];
  };
  ethereumRequest: {
    method: string;
    params?: Array<any>;
  };
  getCurrentPkh: void;
  getPKP: void;
  executeLitAction: { code: string; jsParams: object };

  getDAppTable: void;
  getDAppInfo: string;
  getValidAppCaps: void;
  getModelBaseInfo: string;

  createCapability: {
    app: string;
    resource?: RESOURCE;
    wallet?: WALLET;
  };
  checkCapability: {
    app: string;
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

  createProfile: string;
  getProfiles: string;
  unlock: { streamId?: string; indexFileId?: string };
  isCollected: { datatokenId: string; address: string };
  getDatatokenBaseInfo: string;
}

export interface ReturnType {
  connectWallet: Promise<{
    address: string;
    chain: Chain;
    wallet: WALLET;
  }>;
  switchNetwork: Promise<{ chainId: number; chainName: string }>;
  sign: Promise<string>;
  contractCall: Promise<any>;
  ethereumRequest: Promise<any>;
  getCurrentPkh: Promise<string>;
  getPKP: Promise<{ address: string; publicKey: string }>;
  executeLitAction: Promise<any>;

  getDAppTable: Promise<DAppTable>;
  getDAppInfo: Promise<DAppInfo>;
  getValidAppCaps: Promise<AppsInfo>;
  getModelBaseInfo: Promise<StreamContent>;

  createCapability: Promise<string>;
  checkCapability: Promise<boolean>;
  loadStream: Promise<{
    pkh: string;
    app: string;
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
        app: string;
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
    app: string;
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

  createProfile: Promise<string>;
  getProfiles: Promise<{ id: string }[]>;
  unlock: Promise<{
    streamContent: {
      file: Omit<MirrorFile, "fileKey" | "content">;
      content: StreamContent | string;
    };
  }>;
  isCollected: Promise<boolean>;
  getDatatokenBaseInfo: Promise<object>;
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

export interface EventInput {
  method: string;
  params?: any;
}

export interface EventArguments {
  type: "request";
}
