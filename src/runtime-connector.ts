import { Communicator, PostMessageTo } from "@dataverse/communicator";
import { RequestType, Methods, ReturnType } from "./types/event";

export class Wallet {
  communicator: Communicator;

  constructor(communicator: Communicator) {
    this.communicator = communicator;
  }

  getChainFromPkh(
    params: RequestType[Methods.getChainFromPkh]
  ): ReturnType[Methods.getChainFromPkh] {
    return this.communicator.sendRequest({
      method: Methods.getChainFromPkh,
      params,
    }) as ReturnType[Methods.getChainFromPkh];
  }

  getPkhList(
    params: RequestType[Methods.getPkhList]
  ): ReturnType[Methods.getPkhList] {
    return this.communicator.sendRequest({
      method: Methods.getPkhList,
      params,
    }) as ReturnType[Methods.getPkhList];
  }

  getCurrentPkh(
    params: RequestType[Methods.getCurrentPkh]
  ): ReturnType[Methods.getCurrentPkh] {
    return this.communicator.sendRequest({
      method: Methods.getCurrentPkh,
      params,
    }) as ReturnType[Methods.getCurrentPkh];
  }

  getWalletByPkh(
    params: RequestType[Methods.getWalletByPkh]
  ): ReturnType[Methods.getWalletByPkh] {
    return this.communicator.sendRequest({
      method: Methods.getWalletByPkh,
      params,
    }) as ReturnType[Methods.getWalletByPkh];
  }

  createNewPkh(
    params: RequestType[Methods.createNewPkh]
  ): ReturnType[Methods.createNewPkh] {
    return this.communicator.sendRequest({
      method: Methods.createNewPkh,
      params,
    }) as ReturnType[Methods.createNewPkh];
  }

  switchPkh(
    params: RequestType[Methods.switchPkh]
  ): ReturnType[Methods.switchPkh] {
    return this.communicator.sendRequest({
      method: Methods.switchPkh,
      params,
    }) as ReturnType[Methods.switchPkh];
  }
}

export class RuntimeConnector {
  communicator: Communicator;
  wallet: Wallet;
  constructor(postMessageTo: PostMessageTo) {
    this.communicator = new Communicator({
      source: window,
      target: window.top,
      postMessageTo,
    });
    this.wallet = new Wallet(this.communicator);
  }

  setPostMessageTo(postMessageTo: PostMessageTo) {
    this.communicator.setPostMessageTo(postMessageTo);
  }

  selectWallet(
    params: RequestType[Methods.selectWallet]
  ): ReturnType[Methods.selectWallet] {
    return this.communicator.sendRequest({
      method: Methods.selectWallet,
      params,
    }) as ReturnType[Methods.selectWallet];
  }

  connectWallet(
    params: RequestType[Methods.connectWallet]
  ): ReturnType[Methods.connectWallet] {
    return this.communicator.sendRequest({
      method: Methods.connectWallet,
      params,
    }) as ReturnType[Methods.connectWallet];
  }

  getCurrentWallet(
    params: RequestType[Methods.getCurrentWallet]
  ): ReturnType[Methods.getCurrentWallet] {
    return this.communicator.sendRequest({
      method: Methods.getCurrentWallet,
      params,
    }) as ReturnType[Methods.getCurrentWallet];
  }

  switchNetwork(
    params: RequestType[Methods.switchNetwork]
  ): ReturnType[Methods.switchNetwork] {
    return this.communicator.sendRequest({
      method: Methods.switchNetwork,
      params,
    }) as ReturnType[Methods.switchNetwork];
  }

  sign(params: RequestType[Methods.sign]): ReturnType[Methods.sign] {
    return this.communicator.sendRequest({
      method: Methods.sign,
      params,
    }) as ReturnType[Methods.sign];
  }

  contractCall(
    params: RequestType[Methods.contractCall]
  ): ReturnType[Methods.contractCall] {
    return this.communicator.sendRequest({
      method: Methods.contractCall,
      params,
    }) as ReturnType[Methods.contractCall];
  }

  ethereumRequest(
    params: RequestType[Methods.ethereumRequest]
  ): ReturnType[Methods.ethereumRequest] {
    return this.communicator.sendRequest({
      method: Methods.ethereumRequest,
      params,
    }) as ReturnType[Methods.ethereumRequest];
  }

  createCapibility(
    params: RequestType[Methods.createCapibility]
  ): ReturnType[Methods.createCapibility] {
    return this.communicator.sendRequest({
      method: Methods.createCapibility,
      params,
    }) as ReturnType[Methods.createCapibility];
  }

  checkCapibility(
    params: RequestType[Methods.checkCapibility]
  ): ReturnType[Methods.checkCapibility] {
    return this.communicator.sendRequest({
      method: Methods.checkCapibility,
      params,
    }) as ReturnType[Methods.checkCapibility];
  }

  loadStream(
    params: RequestType[Methods.loadStream]
  ): ReturnType[Methods.loadStream] {
    return this.communicator.sendRequest({
      method: Methods.loadStream,
      params,
    }) as ReturnType[Methods.loadStream];
  }

  loadStreamsBy(
    params: RequestType[Methods.loadStreamsBy]
  ): ReturnType[Methods.loadStreamsBy] {
    return this.communicator.sendRequest({
      method: Methods.loadStreamsBy,
      params,
    }) as ReturnType[Methods.loadStreamsBy];
  }

  getModelBaseInfo(
    params: RequestType[Methods.getModelBaseInfo]
  ): ReturnType[Methods.getModelBaseInfo] {
    return this.communicator.sendRequest({
      method: Methods.getModelBaseInfo,
      params,
    }) as ReturnType[Methods.getModelBaseInfo];
  }

  createStream(
    params: RequestType[Methods.createStream]
  ): ReturnType[Methods.createStream] {
    return this.communicator.sendRequest({
      method: Methods.createStream,
      params,
    }) as ReturnType[Methods.createStream];
  }

  updateStream(
    params: RequestType[Methods.updateStream]
  ): ReturnType[Methods.updateStream] {
    return this.communicator.sendRequest({
      method: Methods.updateStream,
      params,
    }) as ReturnType[Methods.updateStream];
  }

  getDAppTable(
    params: RequestType[Methods.getDAppTable]
  ): ReturnType[Methods.getDAppTable] {
    return this.communicator.sendRequest({
      method: Methods.getDAppTable,
      params,
    }) as ReturnType[Methods.getDAppTable];
  }

  getDAppInfo(
    params: RequestType[Methods.getDAppInfo]
  ): ReturnType[Methods.getDAppInfo] {
    return this.communicator.sendRequest({
      method: Methods.getDAppInfo,
      params,
    }) as ReturnType[Methods.getDAppInfo];
  }

  getValidAppCaps(
    params: RequestType[Methods.getValidAppCaps]
  ): ReturnType[Methods.getValidAppCaps] {
    return this.communicator.sendRequest({
      method: Methods.getValidAppCaps,
      params,
    }) as ReturnType[Methods.getValidAppCaps];
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

  updateFolderBaseInfo(
    params: RequestType[Methods.updateFolderBaseInfo]
  ): ReturnType[Methods.updateFolderBaseInfo] {
    return this.communicator.sendRequest({
      method: Methods.updateFolderBaseInfo,
      params,
    }) as ReturnType[Methods.updateFolderBaseInfo];
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

  uploadFile(
    params: RequestType[Methods.uploadFile]
  ): ReturnType[Methods.uploadFile] {
    return this.communicator.sendRequest({
      method: Methods.uploadFile,
      params,
    }) as ReturnType[Methods.uploadFile];
  }

  updateFileBaseInfo(
    params: RequestType[Methods.updateFileBaseInfo]
  ): ReturnType[Methods.updateFileBaseInfo] {
    return this.communicator.sendRequest({
      method: Methods.updateFileBaseInfo,
      params,
    }) as ReturnType[Methods.updateFileBaseInfo];
  }

  moveFiles(
    params: RequestType[Methods.moveFiles]
  ): ReturnType[Methods.moveFiles] {
    return this.communicator.sendRequest({
      method: Methods.moveFiles,
      params,
    }) as ReturnType[Methods.moveFiles];
  }

  removeFiles(
    params: RequestType[Methods.removeFiles]
  ): ReturnType[Methods.removeFiles] {
    return this.communicator.sendRequest({
      method: Methods.removeFiles,
      params,
    }) as ReturnType[Methods.removeFiles];
  }

  monetizeFile(
    params: RequestType[Methods.monetizeFile]
  ): ReturnType[Methods.monetizeFile] {
    return this.communicator.sendRequest({
      method: Methods.monetizeFile,
      params,
    }) as ReturnType[Methods.monetizeFile];
  }

  createProfile(
    params: RequestType[Methods.createProfile]
  ): ReturnType[Methods.createProfile] {
    return this.communicator.sendRequest({
      method: Methods.createProfile,
      params,
    }) as ReturnType[Methods.createProfile];
  }

  getProfiles(
    params: RequestType[Methods.getProfiles]
  ): ReturnType[Methods.getProfiles] {
    return this.communicator.sendRequest({
      method: Methods.getProfiles,
      params,
    }) as ReturnType[Methods.getProfiles];
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

  getDatatokenMetadata(
    params: RequestType[Methods.getDatatokenMetadata]
  ): ReturnType[Methods.getDatatokenMetadata] {
    return this.communicator.sendRequest({
      method: Methods.getDatatokenMetadata,
      params,
    }) as ReturnType[Methods.getDatatokenMetadata];
  }

  unlock(params: RequestType[Methods.unlock]): ReturnType[Methods.unlock] {
    return this.communicator.sendRequest({
      method: Methods.unlock,
      params,
    }) as ReturnType[Methods.unlock];
  }
}
