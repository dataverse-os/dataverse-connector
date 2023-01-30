import { Communicator } from "../communicator";

const targetOrigin = new Window();
const sourceOrigin = new Window();
const runtimeConnector = new Communicator(sourceOrigin, targetOrigin);

//runtimeConnector.sendRequest({ method: Methods.readFolders });
