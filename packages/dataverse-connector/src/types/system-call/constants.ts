export enum SYSTEM_CALL {
  getPKP = "getPKP",
  executeLitAction = "executeLitAction",

  getValidAppCaps = "getValidAppCaps",
  getModelBaseInfo = "getModelBaseInfo",

  createCapability = "createCapability",
  checkCapability = "checkCapability",

  readFolders = "readFolders",
  readFolderById = "readFolderById",
  createFolder = "createFolder",
  updateFolderBaseInfo = "updateFolderBaseInfo",
  deleteFolder = "deleteFolder",

  readDataUnions = "readDataUnions",
  createDataUnion = "createDataUnion",
  deleteDataUnion = "deleteDataUnion",

  createFile = "createFile",
  updateFile = "updateFile",
  loadFile = "loadFile",
  loadFilesBy = "loadFilesBy",
  createActionFile = "createActionFile",
  updateActionFile = "updateActionFile",
  createBareFile = "createBareFile",
  updateBareFile = "updateBareFile",
  readBareFileContent = "readBareFileContent",
  moveFiles = "moveFiles",
  removeFiles = "removeFiles",
  monetizeFile = "monetizeFile",

  collectFile = "collectFile",
  collectDataUnion = "collectDataUnion",
  unlockFile = "unlockFile",
}
