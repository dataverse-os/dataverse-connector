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

  async connectIdentity(
    params: RequestType[Methods.connectIdentity]
  ): ReturnType[Methods.connectIdentity] {
    const identity = await (this.communicator.sendRequest({
      method: Methods.connectIdentity,
      params,
    }) as ReturnType[Methods.connectIdentity]);

    return identity;
  }

  async readFolders(
    params: RequestType[Methods.readFolders]
  ): ReturnType[Methods.readFolders] {
    const res = await (this.communicator.sendRequest({
      method: Methods.readFolders,
      params,
    }) as ReturnType[Methods.readFolders]);

    return res;
  }

  async createFolder(
    params: RequestType[Methods.createFolder]
  ): ReturnType[Methods.createFolder] {
    const res = await (this.communicator.sendRequest({
      method: Methods.createFolder,
      params,
    }) as ReturnType[Methods.createFolder]);

    return res;
  }

  async changeFolderBaseInfo(
    params: RequestType[Methods.changeFolderBaseInfo]
  ): ReturnType[Methods.changeFolderBaseInfo] {
    const res = (await this.communicator.sendRequest({
      method: Methods.changeFolderBaseInfo,
      params,
    })) as ReturnType[Methods.changeFolderBaseInfo];

    return res;
  }

  async changeFolderType(
    params: RequestType[Methods.changeFolderType]
  ): ReturnType[Methods.changeFolderType] {
    const res = (await this.communicator.sendRequest({
      method: Methods.changeFolderType,
      params,
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
