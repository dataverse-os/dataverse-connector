import { Communicator, PostMessageTo } from "@dataverse/communicator";
import { RequestType, Methods, ReturnType } from "./types/event";
import { Provider } from "./provider";
import { detectDataverseExtension } from "./utils/extensionDetector";
import { formatSendTransactionData } from "./utils/formatSendTransactionData";

export class DataverseConnector {
  communicator: Communicator;
  private provider?: Provider;

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

  getProvider() {
    return this.provider;
  }

  async connectWallet(
    wallet?: RequestType[Methods.connectWallet]
  ): Promise<ReturnType[Methods.connectWallet]> {
    if (!(await detectDataverseExtension())) {
      throw "The plugin has not been loaded yet. Please check the plugin status or go to https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead to install plugins";
    }
    const res = await (this.communicator.sendRequest({
      method: Methods.connectWallet,
      params: wallet,
    }) as ReturnType[Methods.connectWallet]);

    if (!this.provider) {
      this.provider = new Provider(this);
    }

    this.provider.isConnected = true;
    this.provider.wallet = res.wallet;
    this.provider.address = res.address;
    this.provider.chain = res.chain;

    return {
      ...res,
      provider: this.provider,
    } as Awaited<ReturnType[Methods.connectWallet]>;
  }

  async switchNetwork(
    chainId: RequestType[Methods.switchNetwork]
  ): ReturnType[Methods.switchNetwork] {
    const res = await (this.communicator.sendRequest({
      method: Methods.switchNetwork,
      params: chainId,
    }) as ReturnType[Methods.switchNetwork]);
    this.provider.chain = res;
    return res;
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

  async ethereumRequest(
    params: RequestType[Methods.ethereumRequest]
  ): ReturnType[Methods.ethereumRequest] {
    if (params.method === "eth_sendTransaction") {
      if (!params?.params?.[0]?.from) {
        params.params[0].from = this.provider.address;
      }
      if (params?.params?.[0]) {
        Object.entries(params?.params?.[0]).forEach(([key, value]) => {
          params.params[0][key] = formatSendTransactionData(value);
        });
      }
    }

    const res = await (this.communicator.sendRequest({
      method: Methods.ethereumRequest,
      params,
    }) as ReturnType[Methods.ethereumRequest]);

    return res;
  }

  getPKP(): ReturnType[Methods.getPKP] {
    return this.communicator.sendRequest({
      method: Methods.getPKP,
    }) as ReturnType[Methods.getPKP];
  }

  getCurrentPkh(
    params: RequestType[Methods.getCurrentPkh]
  ): ReturnType[Methods.getCurrentPkh] {
    return this.communicator.sendRequest({
      method: Methods.getCurrentPkh,
      params,
    }) as ReturnType[Methods.getCurrentPkh];
  }

  executeLitAction(
    params: RequestType[Methods.executeLitAction]
  ): ReturnType[Methods.executeLitAction] {
    return this.communicator.sendRequest({
      method: Methods.executeLitAction,
      params,
    }) as ReturnType[Methods.executeLitAction];
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

  getModelBaseInfo(
    modelId: RequestType[Methods.getModelBaseInfo]
  ): ReturnType[Methods.getModelBaseInfo] {
    return this.communicator.sendRequest({
      method: Methods.getModelBaseInfo,
      params: modelId,
    }) as ReturnType[Methods.getModelBaseInfo];
  }

  async createCapability(
    params: RequestType[Methods.createCapability]
  ): Promise<ReturnType[Methods.createCapability]> {
    if(!this.provider?.isConnected){
      await this.connectWallet(params.wallet)
    }
    const res = (await this.communicator.sendRequest({
      method: Methods.createCapability,
      params,
    })) as ReturnType[Methods.createCapability];
    this.provider.app = params.app;
    return res;
  }

  checkCapability(
    params?: RequestType[Methods.checkCapability]
  ): ReturnType[Methods.checkCapability] {
    return this.communicator.sendRequest({
      method: Methods.checkCapability,
      params,
    }) as ReturnType[Methods.checkCapability];
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

  loadStream(
    streamId: RequestType[Methods.loadStream]
  ): ReturnType[Methods.loadStream] {
    return this.communicator.sendRequest({
      method: Methods.loadStream,
      params: streamId,
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

  readFolders(): ReturnType[Methods.readFolders] {
    return this.communicator.sendRequest({
      method: Methods.readFolders,
    }) as ReturnType[Methods.readFolders];
  }

  readFolderById(
    folderId: RequestType[Methods.readFolderById]
  ): ReturnType[Methods.readFolderById] {
    return this.communicator.sendRequest({
      method: Methods.readFolderById,
      params: folderId,
    }) as ReturnType[Methods.readFolderById];
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
    folderId: RequestType[Methods.deleteFolder]
  ): ReturnType[Methods.deleteFolder] {
    return this.communicator.sendRequest({
      method: Methods.deleteFolder,
      params: folderId,
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
    handle: RequestType[Methods.createProfile]
  ): ReturnType[Methods.createProfile] {
    return this.communicator.sendRequest({
      method: Methods.createProfile,
      params: handle,
    }) as ReturnType[Methods.createProfile];
  }

  getProfiles(
    address: RequestType[Methods.getProfiles]
  ): ReturnType[Methods.getProfiles] {
    return this.communicator.sendRequest({
      method: Methods.getProfiles,
      params: address,
    }) as ReturnType[Methods.getProfiles];
  }

  unlock(params: RequestType[Methods.unlock]): ReturnType[Methods.unlock] {
    return this.communicator.sendRequest({
      method: Methods.unlock,
      params,
    }) as ReturnType[Methods.unlock];
  }

  isCollected(
    params: RequestType[Methods.isCollected]
  ): ReturnType[Methods.isCollected] {
    return this.communicator.sendRequest({
      method: Methods.isCollected,
      params,
    }) as ReturnType[Methods.isCollected];
  }

  getDatatokenBaseInfo(
    datatokenId: RequestType[Methods.getDatatokenBaseInfo]
  ): ReturnType[Methods.getDatatokenBaseInfo] {
    return this.communicator.sendRequest({
      method: Methods.getDatatokenBaseInfo,
      params: datatokenId,
    }) as ReturnType[Methods.getDatatokenBaseInfo];
  }
}
