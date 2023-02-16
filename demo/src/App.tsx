import "./App.css";
import "./App.css";
import {
  RuntimeConnector,
  Extension,
  Browser,
  METAMASK,
  CRYPTO_WALLET_TYPE,
  Apps,
  ModelNames,
  FolderType,
  StreamObject,
  DecryptionConditionsTypes,
  FileType,
  OriginType,
  IndexFileContentType,
  Mirror,
  Mirrors,
  MirrorFile,
  StructuredFolders,
} from "@dataverse/runtime-connector";
import { DataverseKernel } from "@dataverse/dataverse-kernel";
import React, { useEffect, useRef, useState } from "react";

const runtimeConnector = new RuntimeConnector(Browser);
DataverseKernel.init();
const appName = Apps.dTwitter;
const modelName = ModelNames.post;
const modelNames = [ModelNames.post];

function App() {
  const [address, setAddress] = useState("");
  const [did, setDid] = useState("");
  const [newDid, setNewDid] = useState("");

  const [profileStreamObject, setProfileStreamObject] =
    useState<StreamObject>();
  const [mirrorFile, setMirrorFile] = useState<MirrorFile>();
  const [folderId, setFolderId] = useState("");
  const [folders, setFolders] = useState<StructuredFolders>({});

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
      appName,
      modelNames,
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

  /*** Lit ***/
  const generateAccessControlConditions = async () => {
    const modelId = await runtimeConnector.getModelIdByAppNameAndModelName({
      appName,
      modelName: ModelNames.post,
    });
    const chain = await runtimeConnector.getChainFromLitAuthSig({
      did,
      appName,
      modelNames,
    });
    const conditions: any[] = [
      {
        contractAddress: "",
        standardContractType: "",
        chain,
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: `${address}`,
        },
      },
      { operator: "and" },
      {
        contractAddress: "",
        standardContractType: "SIWE",
        chain,
        method: "",
        parameters: [":resources"],
        returnValueTest: {
          comparator: "contains",
          value: `ceramic://*?model=${modelId}`,
        },
      },
    ];

    return conditions;
  };

  const newLitKey = async () => {
    const decryptionConditions = await generateAccessControlConditions();
    const decryptionConditionsType =
      DecryptionConditionsTypes.AccessControlCondition;

    const { encryptedSymmetricKey } = await runtimeConnector.newLitKey({
      did,
      appName,
      modelNames,
      decryptionConditions,
      decryptionConditionsType,
    });
    console.log(encryptedSymmetricKey);

    return {
      encryptedSymmetricKey,
      decryptionConditions,
      decryptionConditionsType,
    };
  };

  const encryptWithLit = async ({
    content,
    encryptedSymmetricKey,
    decryptionConditions,
    decryptionConditionsType,
  }: {
    content: string;
    encryptedSymmetricKey: string;
    decryptionConditions: any[];
    decryptionConditionsType: DecryptionConditionsTypes;
  }) => {
    const { encryptedContent } = await runtimeConnector.encryptWithLit({
      did,
      appName,
      modelNames,
      content,
      encryptedSymmetricKey,
      decryptionConditions,
      decryptionConditionsType,
    });
    console.log(encryptedContent);

    return encryptedContent;
  };

  const decryptWithLit = async ({
    encryptedContent,
    encryptedSymmetricKey,
    symmetricKeyInBase16Format,
  }: {
    encryptedContent: string;
    encryptedSymmetricKey?: string;
    symmetricKeyInBase16Format?: string;
  }) => {
    const { content } = await runtimeConnector.decryptWithLit({
      did,
      appName,
      modelNames,
      encryptedContent,
      ...(symmetricKeyInBase16Format
        ? { symmetricKeyInBase16Format }
        : {
            encryptedSymmetricKey,
            decryptionConditions: await generateAccessControlConditions(),
            decryptionConditionsType:
              DecryptionConditionsTypes.AccessControlCondition,
          }),
    });
    console.log(content);
    return content;
  };
  /*** Lit ***/

  /*** Profle ***/
  const loadOthersProfileStreamsByModel = async () => {
    const streams = await runtimeConnector.loadStreamsByModel({
      did: "did:pkh:eip155:137:0x8A9800738483e9D42CA377D8F95cc5960e6912d1",
      appName,
      modelName: ModelNames.userProfile,
    });
    console.log(streams);
    const [streamId, streamContent] = Object.entries(streams)[0];
    setProfileStreamObject({ streamId, streamContent });
  };
  const loadMyProfileStreamsByModel = async () => {
    const streams = await runtimeConnector.loadStreamsByModel({
      did,
      appName,
      modelName: ModelNames.userProfile,
    });
    console.log(streams);
    if (Object.entries(streams)[0]) {
      const [streamId, streamContent] = Object.entries(streams)[0];
      setProfileStreamObject({ streamId, streamContent });
    }
  };

  const createProfileStream = async () => {
    const streamObject = await runtimeConnector.createStream({
      did,
      appName,
      modelName: ModelNames.userProfile,
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
      fileType: FileType.Public,
    });
    setProfileStreamObject(streamObject);
    console.log(streamObject);
  };

  const updateProfileStreams = async () => {
    if (!profileStreamObject) return;
    console.log(profileStreamObject);
    profileStreamObject.streamContent.name = "my_name";
    const streams = await runtimeConnector.updateStreams({
      streamsRecord: {
        [profileStreamObject.streamId]: profileStreamObject.streamContent,
      },
      syncImmediately: true,
    });
    console.log(streams);
  };
  /*** Profle ***/

  /*** Post ***/
  const loadMyPostStreamsByModel = async () => {
    const streams = await runtimeConnector.loadStreamsByModel({
      did,
      appName: Apps.dTwitter,
      modelName: ModelNames.post,
    });
    console.log(streams);
    if (Object.entries(streams)[0]) {
      const [streamId, streamContent] = Object.entries(streams)[0];
      setProfileStreamObject({ streamId, streamContent });
    }
  };

  const createPublicPostStream = async () => {
    const streamObject = await runtimeConnector.createStream({
      did,
      appName: Apps.dTwitter,
      modelName: ModelNames.post,
      streamContent: {
        appVersion: "0.0.1",
        content: "a post",
      },
      fileType: FileType.Public,
    });
    console.log(streamObject);
  };

  const createPrivatePostStream = async () => {
    const litKit = await newLitKey();

    const encryptedContent = await encryptWithLit({
      content: "a post",
      ...litKit,
    });

    const streamObject = await runtimeConnector.createStream({
      did,
      appName,
      modelName,
      streamContent: {
        appVersion: "0.0.1",
        content: encryptedContent,
      },
      fileType: FileType.Private,
      ...litKit,
    });
    console.log(streamObject);
  };

  const updatePostStreamsToPublicContent = async () => {
    if (!mirrorFile) return;
    console.log(mirrorFile);
    const { contentId: streamId, content: streamContent } = mirrorFile;
    if (!streamId || !streamContent) return;

    streamContent.content =
      "update my post -- public" + new Date().toISOString(); //public

    const streams = await runtimeConnector.updateStreams({
      streamsRecord: {
        [streamId]: {
          streamContent,
          fileType: FileType.Public,
        },
      },
      syncImmediately: true,
    });
    console.log(streams);
  };

  const updatePostStreamsToPrivateContent = async () => {
    if (!mirrorFile) return;
    console.log(mirrorFile);
    const { contentId: streamId, content: streamContent } = mirrorFile;
    if (!streamId || !streamContent) return;

    let litKit;

    const {
      encryptedSymmetricKey,
      decryptionConditions,
      decryptionConditionsType,
    } = mirrorFile;

    if (
      encryptedSymmetricKey &&
      decryptionConditions &&
      decryptionConditionsType
    ) {
      litKit = {
        encryptedSymmetricKey,
        decryptionConditions,
        decryptionConditionsType,
      };
    } else {
      litKit = await newLitKey();
    }

    streamContent.content = await encryptWithLit({
      content: "update my post -- private" + new Date().toISOString(), //private
      ...litKit,
    }); //private

    const streams = await runtimeConnector.updateStreams({
      streamsRecord: {
        [streamId]: {
          streamContent: streamContent,
          fileType: FileType.Private,
          ...litKit,
        },
      },
      syncImmediately: true,
    });
    console.log(streams);
  };
  /*** Post ***/

  /*** Folders ***/
  const readOthersFolders = async () => {
    const othersFolders = await runtimeConnector.readFolders({
      did: "did:pkh:eip155:137:0x5915e293823FCa840c93ED2E1E5B4df32d699999",
      appName,
    });
    console.log(othersFolders);
  };

  const readMyFolders = async () => {
    const folders = await runtimeConnector.readFolders({
      did,
      appName,
    });
    await Promise.all(
      Object.values(folders).map((folder) => {
        return Promise.all(
          Object.values(folder.mirrors as Mirrors).map(async (mirror) => {
            if (
              !(mirror.mirrorFile.contentType! in IndexFileContentType) &&
              (mirror.mirrorFile.fileKey ||
                (mirror.mirrorFile.encryptedSymmetricKey &&
                  mirror.mirrorFile.decryptionConditions &&
                  mirror.mirrorFile.decryptionConditionsType))
            ) {
              try {
                const content = await decryptWithLit({
                  encryptedContent: mirror.mirrorFile.content.content,
                  ...(mirror.mirrorFile.fileKey
                    ? { symmetricKeyInBase16Format: mirror.mirrorFile.fileKey }
                    : {
                        encryptedSymmetricKey:
                          mirror.mirrorFile.encryptedSymmetricKey,
                      }),
                });
                mirror.mirrorFile.content.content = content;
                return mirror;
              } catch (error) {
                console.log(error);
              }
            }
          })
        );
      })
    );

    let sortedFoldersMirrors = {} as Record<string, Mirror[]>;

    Object.values(folders).forEach((folder) => {
      const sortedMirrors = Object.values(folder.mirrors as Mirrors).sort(
        (mirrorA, mirrorB) =>
          Date.parse(mirrorB.mirrorFile.updatedAt!) -
          Date.parse(mirrorA.mirrorFile.updatedAt!)
      );
      sortedFoldersMirrors[folder.folderId] = sortedMirrors;
    });

    const sortedFolders = Object.values(folders).sort(
      (folderA, folderB) =>
        Date.parse(folderB.updatedAt) - Date.parse(folderA.updatedAt)
    );

    const folderId = sortedFolders[0]?.folderId;

    setFolders(folders);

    setFolderId(folderId);

    setMirrorFile(sortedFoldersMirrors[folderId][0]?.mirrorFile);

    console.log(folders);

    console.log(sortedFoldersMirrors[folderId][0]?.mirrorFile);
  };

  const createFolder = async () => {
    const res = await runtimeConnector.createFolder({
      did,
      appName,
      folderType: FolderType.Private,
      folderName: "Private",
    });
    setFolderId(res.newFolder.folderId);
    console.log(res.newFolder.folderId);
  };

  const changeFolderBaseInfo = async () => {
    const res = await runtimeConnector.changeFolderBaseInfo({
      did,
      appName,
      folderId,
      newFolderName: new Date().toISOString(),
      // syncImmediately: true,
    });
    console.log(res);
  };

  const changeFolderType = async () => {
    const res = await runtimeConnector.changeFolderType({
      did,
      appName,
      folderId,
      targetFolderType: FolderType.Public,
      // syncImmediately: true,
    });
    console.log(res);
  };

  const addMirrors = async () => {
    const res = await runtimeConnector.addMirrors({
      did,
      appName,
      folderId:
        "kjzl6kcym7w8y8w11fog3o2yjg4rzfek4f8wn9df9evdrak5ghr865r2n3e77du",
      filesInfo: [
        {
          contentId:
            "bafybeibsels6lnv7pcoyh4v3diezwm5v7lmp2yezkzczk3hl22hvmhgmwq",
          contentType: IndexFileContentType.CID,
          fileType: FileType.Private,
          mirrorName: "BSC_logo.png",
          originDate: new Date().toISOString(),
          originType: OriginType.upload,
          originURL: "https://dataverse-os.com",
        },
      ],
      syncImmediately: true,
    });
    console.log(res);
  };

  const moveMirrors = async () => {
    const res = await runtimeConnector.moveMirrors({
      did,
      appName,
      targetFolderId:
        "kjzl6kcym7w8y8w11fog3o2yjg4rzfek4f8wn9df9evdrak5ghr865r2n3e77du",
      sourceMirrorIds: [
        "kjzl6kcym7w8y7pysqbirlyxu3jaa54pwnfgqq2j8fnp089favh1cseytpyrfrb",
      ],
      syncImmediately: true,
    });
    console.log(res);
  };

  /*** Folders ***/

  return (
    <div className="App">
      <button onClick={connectWallet}>connectWallet</button>
      <button onClick={connectIdentity}>connectIdentity</button>
      <button onClick={createNewDID}>createNewDID</button>
      <button onClick={switchDID}>switchDID</button>
      <button onClick={loadStream}>loadStream</button>
      {/* <button onClick={loadOthersProfileStreamsByModel}>
        loadOthersProfileStreamsByModel
      </button>
      <button onClick={loadMyProfileStreamsByModel}>
        loadMyProfileStreamsByModel
      </button>
      <button onClick={createProfileStream}>createProfileStream</button>
      <button onClick={updateProfileStreams}>updateProfileStreams</button> */}
      <button onClick={loadMyPostStreamsByModel}>
        loadMyPostStreamsByModel
      </button>
      <button onClick={createPublicPostStream}>createPublicPostStream</button>
      <button onClick={createPrivatePostStream}>createPrivatePostStream</button>
      <button onClick={updatePostStreamsToPublicContent}>
        updatePostStreamsToPublicContent
      </button>
      <button onClick={updatePostStreamsToPrivateContent}>
        updatePostStreamsToPrivateContent
      </button>

      <button onClick={readOthersFolders}>readOthersFolders</button>
      <button onClick={readMyFolders}>readMyFolders</button>
      <button onClick={createFolder}>createFolder</button>
      <button onClick={changeFolderBaseInfo}>changeFolderBaseInfo</button>
      <button onClick={changeFolderType}>changeFolderType</button>
      <button onClick={addMirrors}>addMirrors</button>
      <button onClick={moveMirrors}>moveMirrors</button>
    </div>
  );
}

export default App;
