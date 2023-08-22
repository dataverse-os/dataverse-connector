import { FileType } from "../constants";
import { Action } from "./action-file";
import { EncryptionProvider, MonetizationProvider } from "./common";
import { ContentType } from "./index-file";

export interface MirrorFile {
  fsVersion?: string;
  fileId: string;
  controller?: string;
  action?: Action;
  relationId?: string;
  contentId?: string;
  contentType?: ContentType;
  content?: any;
  fileName?: string;
  fileType?: FileType;
  fileKey?: string;
  accessControl?: {
    encryptionProvider?: EncryptionProvider;
    monetizationProvider?: MonetizationProvider;
  };
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  reserved?: any;
  external?: {
    fileId?: string;
    controller?: string;
    contentId?: string;
    contentType?: ContentType;
    content?: any;
    fileName?: string;
    fileType?: FileType;
    fileKey?: string;
    accessControl?: {
      encryptionProvider?: EncryptionProvider;
      monetizationProvider?: MonetizationProvider;
    };
    createdAt?: string;
    updatedAt?: string;
    deleted?: boolean;
    reserved?: any;
  };
}

export interface Mirror {
  /** the same as index file Id */
  mirrorId: string;
  /** the mirror file of the file */
  mirrorFile: MirrorFile;
  /** the streamID of the folder that contains the file */
  folderId: string;
  /** the contentFolder streamId this mirror belongs to */
  bucketId: string;
  /** whether the mirror is unsynchronized*/
  unsynchronized?: boolean;
}

export interface Mirrors extends Record<string, Mirror> {}

export interface MirrorFiles extends Record<string, MirrorFile> {}
