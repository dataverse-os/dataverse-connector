export enum IndexFileContentType {
  NFT = "NFT",
  CID = "CID",
  MIRROR = "MIRROR",
  VIDEO = "VIDEO",
  WEBSITE = "WEBSITE",
}

export enum OriginType {
  curate, //用插件在其他平台收藏、去他人主页收藏、收藏链接
  upload, //上传文件
  follow,
  click,
}

export enum FileType {
  Public,
  Private,
  Datatoken,
}
