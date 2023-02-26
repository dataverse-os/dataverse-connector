export enum Methods {
  connectWallet = "connectWallet",
  switchNetwork = "switchNetwork",
  connectIdentity = "connectIdentity",
  getChainFromDID = "getChainFromDID",
  getCurrentDID = "getCurrentDID",
  getDIDList = "getDIDList",
  createNewDID = "createNewDID",
  switchDID = "switchDID",

  loadStream = "loadStream",
  loadStreamsByModel = "loadStreamsByModel",
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

  updateFile = "updateFile",

  addMirrors = "addMirrors",
  updateMirror = "updateMirror",
  moveMirrors = "moveMirrors",
  removeMirrors = "removeMirrors",

  createDatatoken = "createDatatoken",
  collect = "collect",
  isCollected = "isCollected",
}
