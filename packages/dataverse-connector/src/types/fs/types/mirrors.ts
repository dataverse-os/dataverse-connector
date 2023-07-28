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
  contentId?: string;
  contentType?: IndexFileContentType;
  content?: any;
  comment?: Comment;
  relation?: Relation;
  additional?: Additional;
  datatokenId?: string;
  fileType?: FileType;
  fileKey?: string;
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
