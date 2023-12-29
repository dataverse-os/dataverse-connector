export enum SYSTEM_CALL {
  getPKP = "getPKP",
  executeLitAction = "executeLitAction",

  getValidAppCaps = "getValidAppCaps",
  getModelBaseInfo = "getModelBaseInfo",

  createCapability = "createCapability",
  checkCapability = "checkCapability",

  createFolder = "createFolder",
  updateFolderBaseInfo = "updateFolderBaseInfo",
  loadFolderTrees = "loadFolderTrees",
  loadFolderById = "loadFolderById",
  deleteFolder = "deleteFolder",

  monetizeFolder = "monetizeFolder",
  updateDataUnionBaseInfo = "updateDataUnionBaseInfo",
  loadCreatedDataUnions = "loadCreatedDataUnions",
  loadCollectedDataUnions = "loadCollectedDataUnions",
  loadDataUnionById = "loadDataUnionById",
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
  loadActionFilesByFileId = "loadActionFilesByFileId",
  loadActionFilesByDataUnionId = "loadActionFilesByDataUnionId",
  loadCreatedDatatokenFiles = "loadCreatedDatatokenFiles",
  loadCollectedDatatokenFiles = "loadCollectedDatatokenFiles",

  monetizeFile = "monetizeFile",
  unlockFile = "unlockFile",
  isFileUnlocked = "isFileUnlocked"
}
