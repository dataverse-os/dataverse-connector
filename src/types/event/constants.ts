export enum Methods {
  connectWallet = "connectWallet",
  getCurrentWallet = "getCurrentWallet",
  switchNetwork = "switchNetwork",
  ethereumRequest = "ethereumRequest",
  signerSign = "signerSign",
  contractCall = "contractCall",
  connectIdentity = "connectIdentity",
  checkIsCurrentDIDValid = "checkIsCurrentDIDValid",
  getChainFromDID = "getChainFromDID",
  getCurrentDID = "getCurrentDID",
  getDIDList = "getDIDList",
  createNewDID = "createNewDID",
  switchDID = "switchDID",

  loadStream = "loadStream",
  loadStreamsByModel = "loadStreamsByModel",
  loadStreamsByModelAndDID = "loadStreamsByModelAndDID",
  getModelBaseInfo = "getModelBaseInfo",
  createStream = "createStream",
  updateStreams = "updateStreams",

  getAllAppsNames = "getAllAppsNames",
  getAllAppsBaseInfo = "getAllAppsBaseInfo",
  getAllAppsInfoByDID = "getAllAppsInfoByDID",
  getModelIdByAppNameAndModelName = "getModelIdByAppNameAndModelName",
  getAppNameAndModelNameByModelId = "getAppNameAndModelNameByModelId",

  newLitKey = "newLitKey",
  getLitKey = "getLitKey",
  encryptWithLit = "encryptWithLit",
  decryptWithLit = "decryptWithLit",

  readFolders = "readFolders",
  readDefaultFolder = "readDefaultFolder",
  readFolderFiles = "readFolderFiles",
  createFolder = "createFolder",
  changeFolderBaseInfo = "changeFolderBaseInfo",
  changeFolderType = "changeFolderType",
  deleteFolder = "deleteFolder",
  monetizeFolder = "monetizeFolder",

  updateFile = "updateFile",

  addMirrors = "addMirrors",
  updateMirror = "updateMirror",
  moveMirrors = "moveMirrors",
  removeMirrors = "removeMirrors",
  monetizeMirror = "monetizeMirror",

  getChainOfDatatoken = "getChainOfDatatoken",
  createLensProfile = "createLensProfile",
  getLensProfiles = "getLensProfiles",
  createDatatoken = "createDatatoken",
  collect = "collect",
  isCollected = "isCollected",
  getDatatokenMetadata = "getDatatokenMetadata",
  unlock = "unlock",

  migrateOldFolders = "migrateOldFolders",
}
