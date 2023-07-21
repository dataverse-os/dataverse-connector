export enum SYSTEM_CALL {
  connectWallet = "connectWallet",
  getPKP = "getPKP",
  executeLitAction = "executeLitAction",

  getValidAppCaps = "getValidAppCaps",
  getModelBaseInfo = "getModelBaseInfo",

  createCapability = "createCapability",
  checkCapability = "checkCapability",
  loadStream = "loadStream",
  loadStreamsBy = "loadStreamsBy",
  createStream = "createStream",
  updateStream = "updateStream",

  readFolders = "readFolders",
  readFolderById = "readFolderById",
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

  unlock = "unlock",
}
