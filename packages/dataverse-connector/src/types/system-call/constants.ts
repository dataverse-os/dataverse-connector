export enum SYSTEM_CALL {
  getPKP = "getPKP",
  executeLitAction = "executeLitAction",

  getValidAppCaps = "getValidAppCaps",
  getModelBaseInfo = "getModelBaseInfo",

  createCapability = "createCapability",
  checkCapability = "checkCapability",

  loadFolderTrees = "loadFolderTrees",
  loadFolderById = "loadFolderById",
  createFolder = "createFolder",
  updateFolderBaseInfo = "updateFolderBaseInfo",
  deleteFolder = "deleteFolder",

  loadDataUnions = "loadDataUnions",
  publishDataUnion = "publishDataUnion",
  deleteDataUnion = "deleteDataUnion",

  createIndexFile = "createIndexFile",
  updateIndexFile = "updateIndexFile",
  createActionFile = "createActionFile",
  updateActionFile = "updateActionFile",
  createBareFile = "createBareFile",
  updateBareFile = "updateBareFile",
  moveFiles = "moveFiles",
  removeFiles = "removeFiles",

  loadFile = "loadFile",
  loadFilesBy = "loadFilesBy",
  loadBareFileContent = "loadBareFileContent",

  monetizeFile = "monetizeFile",
  collectFile = "collectFile",
  collectDataUnion = "collectDataUnion",
  unlockFile = "unlockFile",
  checkIsDataTokenCollectedByAddress = "checkIsDataTokenCollectedByAddress",
  getDatatokenBaseInfo = "getDatatokenBaseInfo",
}
