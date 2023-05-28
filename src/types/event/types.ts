import { Mode } from "../constants";
import { CRYPTO_WALLET, Chain } from "../crypto-wallet";
import {
  AppsInfo,
  DAppInfo,
  DAppTable,
} from "../dapp-verifier/types";
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
  createCapibility: {
    wallet?: CRYPTO_WALLET;
    app?: string;
  };
  checkCapibility: string | undefined;
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
    streamContent: any;
    fileType: FileType;
    encryptedSymmetricKey?: string;
    decryptionConditions?: any[];
    decryptionConditionsType?: DecryptionConditionsTypes;
  };
  updateStream: {
    app?: string;
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

  readFolders: string | undefined;
  readDefaultFolder: { pkh: string; app: string };
  readFolderFiles: { pkh: string; app: string; folderId: string };
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
    datatokenVars: DatatokenVars;
  };

  updateFile: {
    app?: string;
    fileId: string;
    fileInfo: FileInfo;
    syncImmediately?: boolean;
  };

  uploadFile: {
    app?: string;
    folderId: string;
    filesInfo?: (Omit<
      FileInfo,
      | "fileType"
      | "datatokenId"
      | "fileKey"
      | "encryptedSymmetricKey"
      | "decryptionConditions"
      | "decryptionConditionsType"
    > & {
      fileType: FileType;
    })[];
    syncImmediately?: boolean;
  };
  updateFileBaseInfo: {
    app?: string;
    mirrorId: string;
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
    sourceMirrorIds: string[];
    syncImmediately?: boolean;
  };
  removeFiles: {
    app?: string;

    mirrorIds: string[];
    syncImmediately?: boolean;
  };
  monetizeFile: {
    app?: string;
    mirrorId: string;
    datatokenVars: DatatokenVars;
  };

  getChainOfDatatoken: void;
  createLensProfile: string;
  getLensProfiles: string;
  createDatatoken: DatatokenVars;
  collect: {
    app?: string;
    indexFileId: string;
  };
  isCollected: { datatokenId: string; address: string };
  getDatatokenMetadata: string;
  unlock: { app?: string; indexFileId: string };
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
  createCapibility: Promise<string>;
  checkCapibility: Promise<boolean>;
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

  loadStream: Promise<{
    pkh: string;
    app?: string;
    modelName?: string;
    modelId: string;
    streamContent: any;
  }>;
  loadStreamsBy: Promise<Record<string, any>>;
  getModelBaseInfo: Promise<Record<string, any>>;
  createStream: Promise<
    StreamObject & { newMirror?: Mirror; existingMirror?: Mirror }
  >;
  updateStream: Promise<
    | {
        successRecord: StreamsRecord;
        failureRecord: StreamsRecord;
        failureReason?: StreamsRecord;
      }
    | undefined
  >;

  readFolders: Promise<StructuredFolders>;
  readDefaultFolder: Promise<StructuredFolder>;
  readFolderFiles: Promise<Mirrors>;
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

  updateFile: Promise<{
    currentFile: StructuredFile;
    allFiles: StructuredFiles;
  }>;

  uploadFile: Promise<{
    newMirrors: Mirrors;
    isCurated: boolean;
    existingMirror?: Mirror;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  updateFileBaseInfo: Promise<{
    currentMirror: Mirror;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;
  moveFiles: Promise<{
    sourceFolders: StructuredFolders;
    targetFolder: StructuredFolder;
    movedMirrors: Mirrors;
    allFolders: StructuredFolders;
  }>;
  removeFiles: Promise<{
    sourceFolders: StructuredFolders;
    removedMirrors: Mirrors;
    allFolders: StructuredFolders;
  }>;
  monetizeFile: Promise<{
    currentMirror: Mirror;
    currentFolder: StructuredFolder;
    allFolders: StructuredFolders;
  }>;

  getChainOfDatatoken: Promise<string>;
  createLensProfile: Promise<string>;
  getLensProfiles: Promise<{ id: string }[]>;
  createDatatoken: Promise<CreateDatatokenOutPut>;
  collect: Promise<
    CollectOutput &
      Partial<{
        newMirrors: Mirrors;
        isCurated: boolean;
        currentFolder: StructuredFolder;
        allFolders: StructuredFolders;
      }>
  >;
  isCollected: Promise<boolean>;
  getDatatokenMetadata: Promise<DatatokenMetadata>;
  unlock: Promise<object>;
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
