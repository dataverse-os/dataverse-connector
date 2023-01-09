import { RuntimeConnector } from "../runtimeConnector";

const targetOrigin = new Window();
const sourceOrigin = new Window();
const runtimeConnector = new RuntimeConnector(sourceOrigin, targetOrigin);

runtimeConnector.sendRequest({ method: "getProfile" });
runtimeConnector.sendRequest({ method: "setProfile", params: { username: "fxy" } });
