export enum Methods {
  connectWallet = "connectWallet",
  connectIdentity = "connectIdentity",
  createNewDID = "createNewDID",
  switchDID = "switchDID",

  loadStream = "loadStream",
  loadStreamsByModel = "loadStreamsByModel",
  createStream = "createStream",
  updateStreams = "updateStreams",

  getModelIdByAppNameAndModelName = "getModelIdByAppNameAndModelName",
  getAppNameAndModelNameByModelId = "getAppNameAndModelNameByModelId",

  getChainFromLitAuthSig = "getChainFromLitAuthSig",
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
}
