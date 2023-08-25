export enum SYSTEM_CALL {
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
  deleteFolder = "deleteFolder",

  createActionFile = "createActionFile",
  uploadFile = "uploadFile",
  updateFileBaseInfo = "updateFileBaseInfo",
  moveFiles = "moveFiles",
  removeFiles = "removeFiles",
  monetizeFile = "monetizeFile",

  unlock = "unlock",
}
