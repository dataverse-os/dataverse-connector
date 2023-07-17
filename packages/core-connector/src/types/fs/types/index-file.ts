import { DecryptionConditionsTypes } from "../../data-monetize";
import { IndexFileContentType as _IndexFileContentType } from "../constants";
import { FileType, OriginType } from "../constants/index-file";

export interface IndexFile {
  appVersion: string;
  /* The streamId of the content that the file points to */
  contentId: string;
  /* The content type of the file */
  contentType: IndexFileContentType;
  /* includes mirrorName, tags, note */
  comment: string;
  /* includes originType, originURL, originDate */
  relation?: string;
  /* includes embedURL, contentURL */
  additional?: string;
  /* The on-chain postId*/
  datatokenId?: string;
  /* The type of the file, includes public and private */
  fileType: FileType;
  /* The encrypted symmetric key of the file */
  encryptedSymmetricKey?: string;
  /* Lit decryption condition of encrypted symmetric key */
  decryptionConditions?: string;
  /* Lit decryption condition type of encrypted symmetric key. e.g. AccessControlCondition, UnifiedAccessControlCondition*/
  decryptionConditionsType?: DecryptionConditionsTypes;
  /* the creation datetime of the file */
  createdAt: string;
  /* the updation datetime of the file */
  updatedAt: string;
  /* Whether the file is deleted */
  deleted?: boolean;
}

export interface IndexFilesRecord extends Record<string, IndexFile> {}

export interface StructuredFile {
  indexFileId: string;
  appVersion: string;
  /* The creator of the file*/
  controller: string;
  /* The streamId of the content that the file points to */
  contentId: string;
  /* The content type of the file */
  contentType: IndexFileContentType;
  /* includes mirrorName, tags, note */
  comment: Comment;
  /* includes originType, originURL, originDate */
  relation?: Relation;
  /* includes embedURL, contentURL */
  additional?: Additional;
  /* The on-chain postId*/
  datatokenId?: string;
  /* The type of the file, includes public and private */
  fileType: FileType;
  /* The encrypted symmetric key of the file */
  encryptedSymmetricKey?: string;
  /* Lit decryption condition of encrypted symmetric key */
  decryptionConditions?: any[];
  /* Lit decryption condition type of encrypted symmetric key. e.g. AccessControlCondition, UnifiedAccessControlCondition*/
  decryptionConditionsType?: DecryptionConditionsTypes;
  /* the creation datetime of the file */
  createdAt: string;
  /* the updation datetime of the file */
  updatedAt: string;
  /* Whether the file is deleted */
  deleted?: boolean;
}

export type StructuredFiles = Record<string, StructuredFile>;

export interface FileInfo {
  contentId?: string;
  contentType?: IndexFileContentType;
  mirrorName?: string;
  note?: string;
  tags?: string[];
  originType?: OriginType;
  originURL?: string;
  originDate?: string;
  embedURL?: string;
  contentURL?: string;
  fileType?: FileType;
}

export interface Comment {
  mirrorName: string; //名称
  note?: string; //加备注
  tags?: string[]; //打标签
}

export interface Relation {
  originType: OriginType; //文件来源类型
  originURL: string; //文件来源链接
  originDate: string; //文件来源日期
}

export interface Additional {
  embedURL?: string; //视频用iframe可显示的url(仅在内容类型为Video，且为Youtube视频时有值)
  contentURL?: string; //内容原链接(仅在内容类型为NFT时有值)
}

export type IndexFileContentType = _IndexFileContentType | string;
