import { AccessControl } from "../../data-monetize";
import { ActionType, FileType } from "../constants";

export interface ActionFile {
  /* The version of file system*/
  fsVersion: string;
  /* The action of file*/
  action: Action;
  /* The index file that the file points to */
  relationId: string;
  /* The name of the file */
  fileName: string;
  /* The type of the file, includes public, private, payable */
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

export interface ActionFilesRecord extends Record<string, ActionFile> {}

export interface StructuredActionFile
  extends Omit<ActionFile, "accessControl" | "reserved"> {
  fileId: string;
  controller?: string;
  accessControl?: AccessControl;
  reserved?: any;
}

export type StructuredActionFiles = Record<string, StructuredActionFile>;

export interface ActionFileInfo {
  action?: Action;
  relationId?: string;
  fileName?: string;
  fileType?: FileType;
  fileKey?: string;
  accessControl?: AccessControl;
  deleted?: boolean;
  reserved?: any;
}

export interface Action {
  actionType: ActionType;
  comment?: string;
  isRelationIdEncrypted?: boolean;
  isCommentEncrypted?: boolean;
}
