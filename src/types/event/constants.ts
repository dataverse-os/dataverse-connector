export enum Methods {
  connectWallet = "connectWallet",
  switchNetwork = "switchNetwork",
  sign = "sign",
  contractCall = "contractCall",
  ethereumRequest = "ethereumRequest",
  getCurrentPkh = "getCurrentPkh",

  getDAppTable = "getDAppTable",
  getDAppInfo = "getDAppInfo",
  getValidAppCaps = "getValidAppCaps",
  getModelBaseInfo = "getModelBaseInfo",
  
  createCapability = "createCapability",
  checkCapability = "checkCapability",
  loadStream = "loadStream",
  loadStreamsBy = "loadStreamsBy",
  createStream = "createStream",
  updateStream = "updateStream",

  readFolders = "readFolders",
  createFolder = "createFolder",
  updateFolderBaseInfo = "updateFolderBaseInfo",
  changeFolderType = "changeFolderType",
  deleteFolder = "deleteFolder",
  monetizeFolder = "monetizeFolder",

  uploadFile = "uploadFile",
  updateFileBaseInfo = "updateFileBaseInfo",
  moveFiles = "moveFiles",
  removeFiles = "removeFiles",
  monetizeFile = "monetizeFile",

  createProfile = "createProfile",
  getProfiles = "getProfiles",
  unlock = "unlock",
  isCollected = "isCollected",
  getDatatokenBaseInfo = "getDatatokenBaseInfo",
}
