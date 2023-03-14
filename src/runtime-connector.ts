import { Communicator, PostMessageTo } from "@dataverse/communicator";
import { RequestType, Methods, ReturnType } from "./types/event";

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

  connectWallet(
    params: RequestType[Methods.connectWallet]
  ): ReturnType[Methods.connectWallet] {
    return this.communicator.sendRequest({
      method: Methods.connectWallet,
      params,
    }) as ReturnType[Methods.connectWallet];
  }

  switchNetwork(
    params: RequestType[Methods.switchNetwork]
  ): ReturnType[Methods.switchNetwork] {
    return this.communicator.sendRequest({
      method: Methods.switchNetwork,
      params,
    }) as ReturnType[Methods.switchNetwork];
  }

  connectIdentity(
    params: RequestType[Methods.connectIdentity]
  ): ReturnType[Methods.connectIdentity] {
    return this.communicator.sendRequest({
      method: Methods.connectIdentity,
      params,
    }) as ReturnType[Methods.connectIdentity];
  }

  checkIsCurrentDIDValid(
    params: RequestType[Methods.checkIsCurrentDIDValid]
  ): ReturnType[Methods.checkIsCurrentDIDValid] {
    return this.communicator.sendRequest({
      method: Methods.checkIsCurrentDIDValid,
      params,
    }) as ReturnType[Methods.checkIsCurrentDIDValid];
  }

  getChainFromDID(
    params: RequestType[Methods.getChainFromDID]
  ): ReturnType[Methods.getChainFromDID] {
    return this.communicator.sendRequest({
      method: Methods.getChainFromDID,
      params,
    }) as ReturnType[Methods.getChainFromDID];
  }

  getDIDList(
    params: RequestType[Methods.getDIDList]
  ): ReturnType[Methods.getDIDList] {
    return this.communicator.sendRequest({
      method: Methods.getDIDList,
      params,
    }) as ReturnType[Methods.getDIDList];
  }

  getCurrentDID(
    params: RequestType[Methods.getCurrentDID]
  ): ReturnType[Methods.getCurrentDID] {
    return this.communicator.sendRequest({
      method: Methods.getCurrentDID,
      params,
    }) as ReturnType[Methods.getCurrentDID];
  }

  createNewDID(params: RequestType[Methods.createNewDID]): ReturnType[Methods.createNewDID] {
    return this.communicator.sendRequest({
      method: Methods.createNewDID,
      params,
    }) as ReturnType[Methods.createNewDID];
  }

  switchDID(params: RequestType[Methods.switchDID]): ReturnType[Methods.switchDID] {
    return this.communicator.sendRequest({
      method: Methods.switchDID,
      params,
    }) as ReturnType[Methods.switchDID];
  }

  loadStream(params: RequestType[Methods.loadStream]): ReturnType[Methods.loadStream] {
    return this.communicator.sendRequest({
      method: Methods.loadStream,
      params,
    }) as ReturnType[Methods.loadStream];
  }

  loadStreamsByModel(params: RequestType[Methods.loadStreamsByModel]): ReturnType[Methods.loadStreamsByModel] {
    return this.communicator.sendRequest({
      method: Methods.loadStreamsByModel,
      params,
    }) as ReturnType[Methods.loadStreamsByModel];
  }

  loadStreamsByModelAndDID(params: RequestType[Methods.loadStreamsByModelAndDID]): ReturnType[Methods.loadStreamsByModelAndDID] {
    return this.communicator.sendRequest({
      method: Methods.loadStreamsByModelAndDID,
      params,
    }) as ReturnType[Methods.loadStreamsByModelAndDID];
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

  getAllAppsNames(
    params: RequestType[Methods.getAllAppsNames]
  ): ReturnType[Methods.getAllAppsNames] {
    return this.communicator.sendRequest({
      method: Methods.getAllAppsNames,
      params,
    }) as ReturnType[Methods.getAllAppsNames];
  }

  getAllAppsBaseInfo(
    params: RequestType[Methods.getAllAppsBaseInfo]
  ): ReturnType[Methods.getAllAppsBaseInfo] {
    return this.communicator.sendRequest({
      method: Methods.getAllAppsBaseInfo,
      params,
    }) as ReturnType[Methods.getAllAppsBaseInfo];
  }

  getAllAppsInfoByDID(
    params: RequestType[Methods.getAllAppsInfoByDID]
  ): ReturnType[Methods.getAllAppsInfoByDID] {
    return this.communicator.sendRequest({
      method: Methods.getAllAppsInfoByDID,
      params,
    }) as ReturnType[Methods.getAllAppsInfoByDID];
  }

  getModelIdByAppNameAndModelName(
    params: RequestType[Methods.getModelIdByAppNameAndModelName]
  ): ReturnType[Methods.getModelIdByAppNameAndModelName] {
    return this.communicator.sendRequest({
      method: Methods.getModelIdByAppNameAndModelName,
      params,
    }) as ReturnType[Methods.getModelIdByAppNameAndModelName];
  }

  getAppNameAndModelNameByModelId(
    params: RequestType[Methods.getAppNameAndModelNameByModelId]
  ): ReturnType[Methods.getAppNameAndModelNameByModelId] {
    return this.communicator.sendRequest({
      method: Methods.getAppNameAndModelNameByModelId,
      params,
    }) as ReturnType[Methods.getAppNameAndModelNameByModelId];
  }

  newLitKey(
    params: RequestType[Methods.newLitKey]
  ): ReturnType[Methods.newLitKey] {
    return this.communicator.sendRequest({
      method: Methods.newLitKey,
      params,
    }) as ReturnType[Methods.newLitKey];
  }

  encryptWithLit(
    params: RequestType[Methods.encryptWithLit]
  ): ReturnType[Methods.encryptWithLit] {
    return this.communicator.sendRequest({
      method: Methods.encryptWithLit,
      params,
    }) as ReturnType[Methods.encryptWithLit];
  }

  decryptWithLit(
    params: RequestType[Methods.decryptWithLit]
  ): ReturnType[Methods.decryptWithLit] {
    return this.communicator.sendRequest({
      method: Methods.decryptWithLit,
      params,
    }) as ReturnType[Methods.decryptWithLit];
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

  deleteFolder(
    params: RequestType[Methods.deleteFolder]
  ): ReturnType[Methods.deleteFolder] {
    return this.communicator.sendRequest({
      method: Methods.deleteFolder,
      params,
    }) as ReturnType[Methods.deleteFolder];
  }

  monetizeFolder(
    params: RequestType[Methods.monetizeFolder]
  ): ReturnType[Methods.monetizeFolder] {
    return this.communicator.sendRequest({
      method: Methods.monetizeFolder,
      params,
    }) as ReturnType[Methods.monetizeFolder];
  }

  readDefaultFolder(
    params: RequestType[Methods.readDefaultFolder]
  ): ReturnType[Methods.readDefaultFolder] {
    return this.communicator.sendRequest({
      method: Methods.readDefaultFolder,
      params,
    }) as ReturnType[Methods.readDefaultFolder];
  }

  addMirrors(
    params: RequestType[Methods.addMirrors]
  ): ReturnType[Methods.addMirrors] {
    return this.communicator.sendRequest({
      method: Methods.addMirrors,
      params,
    }) as ReturnType[Methods.addMirrors];
  }

  updateMirror(
    params: RequestType[Methods.updateMirror]
  ): ReturnType[Methods.updateMirror] {
    return this.communicator.sendRequest({
      method: Methods.updateMirror,
      params,
    }) as ReturnType[Methods.updateMirror];
  }

  moveMirrors(
    params: RequestType[Methods.moveMirrors]
  ): ReturnType[Methods.moveMirrors] {
    return this.communicator.sendRequest({
      method: Methods.moveMirrors,
      params,
    }) as ReturnType[Methods.moveMirrors];
  }

  removeMirrors(
    params: RequestType[Methods.removeMirrors]
  ): ReturnType[Methods.removeMirrors] {
    return this.communicator.sendRequest({
      method: Methods.removeMirrors,
      params,
    }) as ReturnType[Methods.removeMirrors];
  }

  monetizeMirror(
    params: RequestType[Methods.monetizeMirror]
  ): ReturnType[Methods.monetizeMirror] {
    return this.communicator.sendRequest({
      method: Methods.monetizeMirror,
      params,
    }) as ReturnType[Methods.monetizeMirror];
  }

  createDatatoken(
    params: RequestType[Methods.createDatatoken]
  ): ReturnType[Methods.createDatatoken] {
    return this.communicator.sendRequest({
      method: Methods.createDatatoken,
      params,
    }) as ReturnType[Methods.createDatatoken];
  }

  collect(params: RequestType[Methods.collect]): ReturnType[Methods.collect] {
    return this.communicator.sendRequest({
      method: Methods.collect,
      params,
    }) as ReturnType[Methods.collect];
  }

  isCollected(
    params: RequestType[Methods.isCollected]
  ): ReturnType[Methods.isCollected] {
    return this.communicator.sendRequest({
      method: Methods.isCollected,
      params,
    }) as ReturnType[Methods.isCollected];
  }

  migrateOldFolders(
    params: RequestType[Methods.migrateOldFolders]
  ): ReturnType[Methods.migrateOldFolders] {
    return this.communicator.sendRequest({
      method: Methods.migrateOldFolders,
      params,
    }) as ReturnType[Methods.migrateOldFolders];
  }
}
