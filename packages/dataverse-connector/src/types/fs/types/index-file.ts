import { AccessControl } from "../../data-monetize";
import { FileType, StorageResource } from "../constants";

export interface IndexFile {
  /* The version of file system*/
  fsVersion: string;
  /* The streamId of the content that the file points to */
  contentId: string;
  /* The content type of the file */
  contentType: string;
  /* The name of the file */
  fileName: string;
  /* The type of the file, includes public and private */
  fileType: FileType;
  /* The access control condition of the file */
  accessControl?: string;
  /* the creation datetime of the file */
  createdAt: string;
  /* the updation datetime of the file */
  updatedAt: string;
  /* Whether the file is deleted */
  deleted?: boolean;
  /* extra field */
  reserved?: string;
}

export interface IndexFileRecord
  extends Record<string, IndexFile & { controller: string }> {}

export interface StructuredFile
  extends Omit<IndexFile, "accessControl" | "contentType" | "reserved"> {
  fileId: string;
  controller?: string;
  contentType: ContentType;
  accessControl?: AccessControl;
  reserved?: any;
}

export type StructuredFiles = Record<string, StructuredFile>;

export interface FileInfo {
  contentId?: string;
  contentType?: ContentType;
  fileName?: string;
  fileType?: FileType;
  fileKey?: string;
  accessControl?: AccessControl;
  deleted?: boolean;
  reserved?: any;
}

export interface ContentType {
  resource: StorageResource;
  resourceId?: string;
}
