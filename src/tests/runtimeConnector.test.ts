import { Methods } from "@dataverse/dataverse-kernel/dist/cjs/event";
import { RuntimeConnector } from "../runtimeConnector";

const targetOrigin = new Window();
const sourceOrigin = new Window();
const runtimeConnector = new RuntimeConnector(sourceOrigin, targetOrigin);

//runtimeConnector.sendRequest({ method: Methods.readFolders });
