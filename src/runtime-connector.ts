import { Communicator } from "@dataverse/communicator";
import {
  Methods,
  RequestType,
  ReturnType,
  FolderType,
  Mirrors,
} from "@dataverse/dataverse-kernel";

export class RuntimeConnector {
  communicator: Communicator;

  constructor() {
    this.communicator = new Communicator(window, window.top);
  }

  async connectIdentity({
    wallet,
    appName,
    modelNames,
  }: RequestType[Methods.connectIdentity]): ReturnType[Methods.connectIdentity] {
    const identity = await (this.communicator.sendRequest({
      method: Methods.connectIdentity,
      params: { wallet, appName, modelNames },
    }) as ReturnType[Methods.connectIdentity]);

    return identity;
  }

  async readFolders({
    did,
    appName,
  }: {
    did: string;
    appName: string;
  }): ReturnType[Methods.readFolders] {
    const res = await (this.communicator.sendRequest({
      method: Methods.readFolders,
      params: { did, appName },
    }) as ReturnType[Methods.readFolders]);

    return res;
  }

  async createFolder({
    did,
    appName,
    folderType,
    folderName,
    folderDescription,
    mirrors,
    curationId,
    previews,
  }: {
    did: string;
    appName: string;
    folderType: FolderType;
    folderName: string;
    folderDescription?: string;
    mirrors?: Mirrors;
    curationId?: string;
    previews?: Mirrors;
  }): ReturnType[Methods.createFolder] {
    const res = await (this.communicator.sendRequest({
      method: Methods.createFolder,
      params: {
        did,
        appName,
        folderType,
        folderName,
        folderDescription,
        mirrors,
        curationId,
        previews,
      },
    }) as ReturnType[Methods.createFolder]);

    return res;
  }

  async changeFolderBaseInfo({
    did,
    appName,
    folderId,
    newFolderName,
    newFolderDescription,
    syncImmediately,
  }: {
    did: string;
    appName: string;
    folderId: string;
    newFolderName: string;
    newFolderDescription?: string;
    syncImmediately?: boolean;
  }): ReturnType[Methods.changeFolderBaseInfo] {
    const res = (await this.communicator.sendRequest({
      method: Methods.changeFolderBaseInfo,
      params: {
        did,
        appName,
        folderId,
        newFolderName,
        newFolderDescription,
        syncImmediately,
      },
    })) as ReturnType[Methods.changeFolderBaseInfo];

    return res;
  }

  async changeFolderType({
    did,
    appName,
    folderId,
    targetFolderType,
    folderDescription,
    openMirrorIds,
    syncImmediately,
  }: {
    did: string;
    appName: string;
    folderId: string;
    targetFolderType: FolderType;
    folderDescription?: string;
    openMirrorIds?: string[];
    syncImmediately?: boolean;
  }): ReturnType[Methods.changeFolderType] {
    const res = (await this.communicator.sendRequest({
      method: Methods.changeFolderType,
      params: {
        did,
        appName,
        folderId,
        targetFolderType,
        folderDescription,
        openMirrorIds,
        syncImmediately,
      },
    })) as ReturnType[Methods.changeFolderType];

    return res;
  }

  changeFolderContent() {}
  deleteFolder() {}
  syncFolder() {}
  readFile() {}
  addMirrors() {}
  updateMirror() {}
  moveMirrors() {}
  removeMirrors() {}
  //profiles
  loadStreams() {}
}
