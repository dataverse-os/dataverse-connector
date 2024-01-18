import { ReturnType, SYSTEM_CALL } from "../../system-call";

export type FileContent = Record<string, any>;

export type FileRecord = Awaited<ReturnType[SYSTEM_CALL.loadFile]>;
