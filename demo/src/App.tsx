import "./App.css";
import "./App.css";
import {
  RuntimeConnector,
  init,
  userProfile,
  Extension,
  Browser,
  METAMASK,
  CRYPTO_WALLET_TYPE,
  Dataverse,
  FolderType,
  StreamObject,
} from "@dataverse/runtime-connector";
import { useEffect, useRef, useState } from "react";
import {} from "@dataverse/dataverse-kernel/";

const runtimeConnector = new RuntimeConnector(Browser);
init;

function App() {
  const [address, setAddress] = useState("");
  const [did, setDid] = useState("");
  const [newDid, setNewDid] = useState("");
  const [streamObject, setStreamObject] = useState<StreamObject>();
  const [folderId, setFolderId] = useState("");

  const connectWallet = async () => {
    const address = await runtimeConnector.connectWallet({
      name: METAMASK,
      type: CRYPTO_WALLET_TYPE,
    });
    setAddress(address);
    console.log(address);
  };

  const connectIdentity = async () => {
    const did = await runtimeConnector.connectIdentity({
      wallet: { name: METAMASK, type: CRYPTO_WALLET_TYPE },
      appName: Dataverse,
      // modelNames: init.dappVerifier.getModelNamesByAppName(Dataverse),
    });
    setDid(did);
    console.log(did);
  };

  const createNewDID = async () => {
    const { currentDid, createdDidList } = await runtimeConnector.createNewDID({
      name: METAMASK,
      type: CRYPTO_WALLET_TYPE,
    });
    setNewDid(currentDid);
    console.log({ currentDid, createdDidList });
  };

  const switchDID = async () => {
    await runtimeConnector.switchDID(
      "did:pkh:eip155:137:0x3c6216caE32FF6691C55cb691766220Fd3f55555"
    );
  };

  const loadStream = async () => {
    const streams = await runtimeConnector.loadStream(
      "kjzl6kcym7w8y54hkcylumliloa2ut95ec5ae74w5vh95rt6co6b5u3lprjr0gj"
    );
    console.log(streams);
  };

  const loadOthersStreamsByModel = async () => {
    const streams = await runtimeConnector.loadStreamsByModel({
      did: "did:pkh:eip155:137:0x8A9800738483e9D42CA377D8F95cc5960e6912d1",
      appName: Dataverse,
      modelName: userProfile,
    });
    console.log(streams);
    const [streamId, streamContent] = Object.entries(streams)[0];
    setStreamObject({ streamId, streamContent });
  };

  const loadMyStreamsByModel = async () => {
    const streams = await runtimeConnector.loadStreamsByModel({
      did,
      appName: Dataverse,
      modelName: userProfile,
    });
    console.log(streams);
    const [streamId, streamContent] = Object.entries(streams)[0];
    setStreamObject({ streamId, streamContent });
  };

  const createStream = async () => {
    const streamObject = await runtimeConnector.createStream({
      did,
      appName: Dataverse,
      modelName: userProfile,
      streamContent: {
        name: "test_name",
        description: "test_description",
        image: {
          original: {
            src: "https://i.seadn.io/gcs/files/4df295e05429b6e56e59504b7e9650b6.gif?w=500&auto=format",
          },
        },
        background: {
          original: {
            src: "https://i.seadn.io/gae/97v7uBu0TGycl_CT73Wds8T22sqLZISSszf4f4mCrPEv5yOLn840HZU4cIyEc9WNpxXhjcyKSKdTuqH7svb3zBfl1ixVtX5Jtc3VzA?w=500&auto=format",
          },
        },
      },
    });
    setStreamObject(streamObject);
    console.log(streamObject);
  };

  const updateStreams = async () => {
    if (!streamObject) return;
    console.log(streamObject);
    streamObject.streamContent.name = "my_name";
    const streams = await runtimeConnector.updateStreams({
      streamsRecord: { [streamObject.streamId]: streamObject.streamContent },
      syncImmediately: true,
    });
    console.log(streams);
  };

  const readOthersFolders = async () => {
    const othersFolders = await runtimeConnector.readFolders({
      did: "did:pkh:eip155:137:0x5915e293823FCa840c93ED2E1E5B4df32d699999",
      appName: Dataverse,
    });
    console.log(othersFolders);
  };

  const readMyFolders = async () => {
    const folders = await runtimeConnector.readFolders({
      did,
      appName: Dataverse,
    });
    setFolderId(Object.keys(folders)[0]);
    console.log(folders);
  };

  const createFolder = async () => {
    const createFolderRes = await runtimeConnector.createFolder({
      did,
      appName: Dataverse,
      folderType: FolderType.Private,
      folderName: "Private",
    });
    setFolderId(createFolderRes.newFolder.folderId);
    console.log(createFolderRes.newFolder.folderId);
  };

  const changeFolderBaseInfo = async () => {
    const changeFolderBaseInfoRes = await runtimeConnector.changeFolderBaseInfo(
      {
        did,
        appName: Dataverse,
        folderId,
        newFolderName: new Date().toISOString(),
        // syncImmediately: true,
      }
    );
    console.log(changeFolderBaseInfoRes.currentFolder.options.folderName);
  };

  const changeFolderType = async () => {
    const changeFolderTypeRes = await runtimeConnector.changeFolderType({
      did,
      appName: Dataverse,
      folderId,
      targetFolderType: FolderType.Public,
      // syncImmediately: true,
    });
    console.log(changeFolderTypeRes.currentFolder.folderType);
  };

  return (
    <div className="App">
      <button onClick={connectWallet}>connectWallet</button>
      <button onClick={connectIdentity}>connectIdentity</button>
      <button onClick={createNewDID}>createNewDID</button>
      <button onClick={switchDID}>switchDID</button>
      <button onClick={loadStream}>loadStream</button>
      <button onClick={loadOthersStreamsByModel}>
        loadOthersStreamsByModel
      </button>
      <button onClick={loadMyStreamsByModel}>loadMyStreamsByModel</button>
      <button onClick={createStream}>createStream</button>
      <button onClick={updateStreams}>updateStreams</button>
      <button onClick={readOthersFolders}>readOthersFolders</button>
      <button onClick={readMyFolders}>readMyFolders</button>
      <button onClick={createFolder}>createFolder</button>
      <button onClick={changeFolderBaseInfo}>changeFolderBaseInfo</button>
      <button onClick={changeFolderType}>changeFolderType</button>
    </div>
  );
}

export default App;
