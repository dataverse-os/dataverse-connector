import { Communicator, PostMessageTo } from "@dataverse/communicator";
import { Methods, RequestType, ReturnType } from "@dataverse/dataverse-kernel";

export class RuntimeConnector {
  communicator: Communicator;

  constructor(postMessageTo: PostMessageTo) {
    this.communicator = new Communicator({
      source: window,
      target: window.top,
      postMessageTo,
    });
  }

  setPostMessageTo(postMessageTo: PostMessageTo) {
    this.communicator.setPostMessageTo(postMessageTo);
  }

  async connectWallet(
    params: RequestType[Methods.connectWallet]
  ): ReturnType[Methods.connectWallet] {
    const res = (await this.communicator.sendRequest({
      method: Methods.connectWallet,
      params,
    })) as ReturnType[Methods.connectWallet];
    return res;
  }

  connectIdentity(
    params: RequestType[Methods.connectIdentity]
  ): ReturnType[Methods.connectIdentity] {
    return this.communicator.sendRequest({
      method: Methods.connectIdentity,
      params,
    }) as ReturnType[Methods.connectIdentity];
  }

  createNewDID(params: RequestType[Methods.createNewDID]) {
    return this.communicator.sendRequest({
      method: Methods.createNewDID,
      params,
    }) as ReturnType[Methods.createNewDID];
  }

  switchDID(params: RequestType[Methods.switchDID]) {
    return this.communicator.sendRequest({
      method: Methods.switchDID,
      params,
    }) as ReturnType[Methods.switchDID];
  }

  loadStream(params: RequestType[Methods.loadStream]) {
    return this.communicator.sendRequest({
      method: Methods.loadStream,
      params,
    }) as ReturnType[Methods.loadStream];
  }

  loadStreamsByModel(params: RequestType[Methods.loadStreamsByModel]) {
    return this.communicator.sendRequest({
      method: Methods.loadStreamsByModel,
      params,
    }) as ReturnType[Methods.loadStreamsByModel];
  }

  createStream(
    params: RequestType[Methods.createStream]
  ): ReturnType[Methods.createStream] {
    return this.communicator.sendRequest({
      method: Methods.createStream,
      params,
    }) as ReturnType[Methods.createStream];
  }

  updateStreams(
    params: RequestType[Methods.updateStreams]
  ): ReturnType[Methods.updateStreams] {
    return this.communicator.sendRequest({
      method: Methods.updateStreams,
      params,
    }) as ReturnType[Methods.updateStreams];
  }

  newLitKey(
    params: RequestType[Methods.newLitKey]
  ): ReturnType[Methods.newLitKey] {
    return this.communicator.sendRequest({
      method: Methods.newLitKey,
      params,
    }) as ReturnType[Methods.newLitKey];
  }

  getLitKey(
    params: RequestType[Methods.getLitKey]
  ): ReturnType[Methods.getLitKey] {
    return this.communicator.sendRequest({
      method: Methods.getLitKey,
      params,
    }) as ReturnType[Methods.getLitKey];
  }

  readFolders(
    params: RequestType[Methods.readFolders]
  ): ReturnType[Methods.readFolders] {
    return this.communicator.sendRequest({
      method: Methods.readFolders,
      params,
    }) as ReturnType[Methods.readFolders];
  }

  createFolder(
    params: RequestType[Methods.createFolder]
  ): ReturnType[Methods.createFolder] {
    return this.communicator.sendRequest({
      method: Methods.createFolder,
      params,
    }) as ReturnType[Methods.createFolder];
  }

  changeFolderBaseInfo(
    params: RequestType[Methods.changeFolderBaseInfo]
  ): ReturnType[Methods.changeFolderBaseInfo] {
    return this.communicator.sendRequest({
      method: Methods.changeFolderBaseInfo,
      params,
    }) as ReturnType[Methods.changeFolderBaseInfo];
  }

  changeFolderType(
    params: RequestType[Methods.changeFolderType]
  ): ReturnType[Methods.changeFolderType] {
    return this.communicator.sendRequest({
      method: Methods.changeFolderType,
      params,
    }) as ReturnType[Methods.changeFolderType];
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
