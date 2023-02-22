import { DecryptionConditionsTypes } from "../../data-monetize";
import { FileType } from "../constants/index-file";
import {
  Comment,
  Relation,
  Additional,
  IndexFileContentType,
} from "./index-file";

export interface MirrorFile {
  appVersion?: string;
  indexFileId: string;
  contentId?: string; //内容唯一标识符
  contentType?: IndexFileContentType; //内容类型
  content?: any; //当contentType为stream时contentId指向的实际内容
  comment?: Comment;
  relation?: Relation;
  additional?: Additional;
  datatokenId?: string; //链上数据Id
  fileType?: FileType;
  fileKey?: string; //解密indexFile对应内容的对称密钥
  encryptedSymmetricKey?: string;
  decryptionConditions?: any[];
  decryptionConditionsType?: DecryptionConditionsTypes;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

export interface Mirror {
  /** the uuid of the file */
  mirrorId: string;
  /** the mirror file of the file */
  mirrorFile: MirrorFile;
  /** the streamID of the folder that contains the file */
  folderId: string;
  /** the contentFolder streamId this mirror belongs to */
  bucketId: string;
  /** whether an open item for curation */
  open?: boolean;
  /** whether the mirror is unsynchronized*/
  unsynchronized?: boolean;
}

export interface Mirrors extends Record<string, Mirror> {}

export interface MirrorFiles extends Record<string, MirrorFiles> {}
