import "./App.css";
import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import {
  RuntimeConnector,
  Extension,
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
  Currency,
  Browser,
} from "@dataverse/runtime-connector";

// import { DataverseKernel } from "@dataverse/dataverse-kernel";
// DataverseKernel.init();
const runtimeConnector = new RuntimeConnector(Extension);
const appName = Apps.Dataverse;
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

  /*** Identity ***/
  const connectWallet = async () => {
    try {
      const address = await runtimeConnector.connectWallet({
        name: METAMASK,
        type: CRYPTO_WALLET_TYPE,
      });
      setAddress(address);
      console.log(address);
    } catch (error) {
      console.log(error);
    }
  };

  const switchNetwork = async () => {
    const res = await runtimeConnector.switchNetwork(137);
    console.log(res);
  };

  const connectIdentity = async () => {
    await connectWallet()
    await switchNetwork()
    const did = await runtimeConnector.connectIdentity({
      wallet: { name: METAMASK, type: CRYPTO_WALLET_TYPE },
      appName,
    });
    setDid(did);
    console.log(did);
    return did;
  };

  const getCurrentDID = async () => {
    const res = await runtimeConnector.getCurrentDID();
    console.log(res);
  };

  const getChainFromDID = async () => {
    const chain = await runtimeConnector.getChainFromDID(
      "did:pkh:eip155:137:0x3c6216caE32FF6691C55cb691766220Fd3f55555"
    );
    console.log(chain);
  };

  const getDIDList = async () => {
    const res = await runtimeConnector.getDIDList();
    console.log(res);
  };

  const createNewDID = async () => {
    const { currentDID, createdDIDList } = await runtimeConnector.createNewDID({
      name: METAMASK,
      type: CRYPTO_WALLET_TYPE,
    });
    setNewDid(currentDID);
    console.log({ currentDID, createdDIDList });
  };

  const switchDID = async () => {
    await runtimeConnector.switchDID(
      "did:pkh:eip155:137:0x3c6216caE32FF6691C55cb691766220Fd3f55555"
    );
  };

  /*** Identity ***/

  /*** APP Registry ***/

  const getAllAppsNames = async () => {
    const appsInfo = await runtimeConnector.getAllAppsNames();
    console.log(appsInfo);
  };

  const getAllAppsBaseInfo = async () => {
    const appsInfo = await runtimeConnector.getAllAppsBaseInfo();
    console.log(appsInfo);
  };

  const getAllAppsInfoByDID = async () => {
    const appsInfo = await runtimeConnector.getAllAppsInfoByDID(
      "did:pkh:eip155:137:0x29761660d6Cb26a08e9A9c7de12E0038eE9cb623"
    );
    console.log(appsInfo);
  };

  const getModelIdByAppNameAndModelName = async () => {
    const modelId = await runtimeConnector.getModelIdByAppNameAndModelName({
      appName,
      modelName,
    });
    console.log(modelId);
  };

  const getAppNameAndModelNameByModelId = async () => {
    const { appName, modelName } =
      await runtimeConnector.getAppNameAndModelNameByModelId(
        "kjzl6hvfrbw6ca5b90vik6aerp2cfqlphn52yznmie4pvclbgycekr0d7py09sl"
      );
    console.log({ appName, modelName });
  };
  /*** APP Registry ***/

  /*** Lit ***/
  const generateAccessControlConditions = async () => {
    const modelId = await runtimeConnector.getModelIdByAppNameAndModelName({
      appName,
      modelName,
    });
    const chain = await runtimeConnector.getChainFromDID(did);
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

  const encrypt = async () => {
    const decryptionConditions = await generateAccessControlConditions();
    const decryptionConditionsType =
      DecryptionConditionsTypes.AccessControlCondition;

    const { encryptedContent } = await runtimeConnector.encryptWithLit({
      did,
      appName,
      modelNames,
      content: "hello world",
      encryptedSymmetricKey:
        "02c67ba96980c11042f9e52262d48486b846af2acb7efb21ce01dafeef5697dc0f61213b6f0330883aa2b456b142550ffdd55e79b66ad399176f9f0e25ce694f3601ad1d35736db41917a12cb044b80c02199d104b8be9df0468a60514a5aca285ac6b99d478b158c59227a6e5cc223d3d1cc099a7540c14cc9c669068425bea0000000000000020603a50b4737163a66dd0172f012faedfb9a8cbb35d8da8155ff12a3c1d8ad611ad6adc5b953d118dc1fb76678422a898",
      decryptionConditions,
      decryptionConditionsType,
    });
    console.log(encryptedContent);
  };

  const decrypt = async () => {
    const decryptionConditions = await generateAccessControlConditions();
    const decryptionConditionsType =
      DecryptionConditionsTypes.AccessControlCondition;

    const encryptedContent = "erS5KV4HfggZ8-2iC2bj1uMZwiOA38z73DxVhXGeAGw=";
    const symmetricKeyInBase16Format = "";
    const encryptedSymmetricKey =
      "02c67ba96980c11042f9e52262d48486b846af2acb7efb21ce01dafeef5697dc0f61213b6f0330883aa2b456b142550ffdd55e79b66ad399176f9f0e25ce694f3601ad1d35736db41917a12cb044b80c02199d104b8be9df0468a60514a5aca285ac6b99d478b158c59227a6e5cc223d3d1cc099a7540c14cc9c669068425bea0000000000000020603a50b4737163a66dd0172f012faedfb9a8cbb35d8da8155ff12a3c1d8ad611ad6adc5b953d118dc1fb76678422a898";

    const { content } = await runtimeConnector.decryptWithLit({
      did,
      appName,
      modelNames,
      encryptedContent,
      ...(symmetricKeyInBase16Format
        ? { symmetricKeyInBase16Format }
        : {
            encryptedSymmetricKey,
            decryptionConditions,
            decryptionConditionsType,
          }),
    });
    console.log(content);
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
  const loadStream = async () => {
    const stream = await runtimeConnector.loadStream(
      "kjzl6kcym7w8yac29293oqcec2rz7ellksdiuc6ea9xpnwymdctrstbmc1xhrgw"
    );
    console.log(stream);
  };

  const loadMyPostStreamsByModel = async () => {
    const streams = await runtimeConnector.loadStreamsByModel({
      did: "did:pkh:eip155:137:0x3c6216caE32FF6691C55cb691766220Fd3f55555",
      appName,
      modelName,
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
      appName,
      modelName,
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
    console.log({
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
      did: "did:pkh:eip155:137:0xdC4b09aBf7dB2Adf6C5b4d4f34fd54759aAA5Ccd",
      appName,
    });
    console.log(othersFolders);
  };

  const readMyFolders = async () => {
    const did = await connectIdentity();
    const folders = await runtimeConnector.readFolders({
      did,
      appName,
    });
    console.log({ folders });
    return folders;
    // await Promise.all(
    //   Object.values(folders).map((folder) => {
    //     return Promise.all(
    //       Object.values(folder.mirrors as Mirrors).map(async (mirror) => {
    //         if (
    //           !(mirror.mirrorFile.contentType! in IndexFileContentType) &&
    //           (mirror.mirrorFile.fileKey ||
    //             (mirror.mirrorFile.encryptedSymmetricKey &&
    //               mirror.mirrorFile.decryptionConditions &&
    //               mirror.mirrorFile.decryptionConditionsType))
    //         ) {
    //           try {
    //             const content = await decryptWithLit({
    //               encryptedContent: mirror.mirrorFile.content.content,
    //               ...(mirror.mirrorFile.fileKey
    //                 ? { symmetricKeyInBase16Format: mirror.mirrorFile.fileKey }
    //                 : {
    //                     encryptedSymmetricKey:
    //                       mirror.mirrorFile.encryptedSymmetricKey,
    //                   }),
    //             });
    //             mirror.mirrorFile.content.content = content;
    //             return mirror;
    //           } catch (error) {
    //             console.log(error);
    //           }
    //         }
    //       })
    //     );
    //   })
    // );

    // let sortedFoldersMirrors = {} as Record<string, Mirror[]>;

    // Object.values(folders).forEach((folder) => {
    //   const sortedMirrors = Object.values(folder.mirrors as Mirrors).sort(
    //     (mirrorA, mirrorB) =>
    //       Date.parse(mirrorB.mirrorFile.updatedAt!) -
    //       Date.parse(mirrorA.mirrorFile.updatedAt!)
    //   );
    //   sortedFoldersMirrors[folder.folderId] = sortedMirrors;
    // });

    // const sortedFolders = Object.values(folders).sort(
    //   (folderA, folderB) =>
    //     Date.parse(folderB.updatedAt) - Date.parse(folderA.updatedAt)
    // );

    // const folderId = sortedFolders[0]?.folderId;

    // setFolders(folders);

    // setFolderId(folderId);

    // setMirrorFile(sortedFoldersMirrors[folderId]?.[0]?.mirrorFile);

    // console.log(folders);

    // console.log(folderId);

    // console.log(sortedFoldersMirrors[folderId]?.[0]?.mirrorFile);
  };

  const createFolder = async () => {
    const res = await runtimeConnector.createFolder({
      did,
      appName,
      folderType: FolderType.Private,
      folderName: "Private",
    });
    console.log(res);
    setFolderId(res.newFolder.folderId);
    console.log(res.newFolder.folderId);
  };

  const changeFolderBaseInfo = async () => {
    const res = await runtimeConnector.changeFolderBaseInfo({
      did,
      appName,
      folderId:
        "kjzl6kcym7w8y9pgztpm5dmhiiz6pg87s0w8ul5tu6idwhff9z2raxbgzqdugq8",
      newFolderDescription: new Date().toISOString(),
      syncImmediately: true,
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

  const deleteFolder = async () => {
    const res = await runtimeConnector.deleteFolder({
      did,
      appName,
      folderId,
      syncImmediately: true,
    });
    console.log(res);
  };

  const deleteAllFolder = async () => {
    const did = await connectIdentity();
    const folders = await runtimeConnector.readFolders({
      did,
      appName,
    });
    await Promise.all(
      Object.keys(folders).map((folderId) =>
        runtimeConnector.deleteFolder({
          did,
          appName,
          folderId,
          syncImmediately: true
        })
      )
    );
    readMyFolders();
  };

  const addMirrors = async () => {
    const res = await runtimeConnector.addMirrors({
      did,
      appName,
      folderId: folderId,
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

  const updateMirror = async () => {
    const res = await runtimeConnector.updateMirror({
      did,
      appName,
      mirrorId:
        "kjzl6kcym7w8y6obo38hb8k543zk04vsm55mqq2wgcg0wkhqz895b585tw3vuo9",
      fileInfo: {
        fileType: FileType.Public,
      },
      syncImmediately: true,
    });
    console.log(res);
  };

  const moveMirrors = async () => {
    const res = await runtimeConnector.moveMirrors({
      did,
      appName,
      targetFolderId:
        "kjzl6kcym7w8y94clt1zso1lov99lhu14q0fr2vl8i1nn55slrz47dvqix0it6o",
      sourceMirrorIds: [
        "kjzl6kcym7w8y6obo38hb8k543zk04vsm55mqq2wgcg0wkhqz895b585tw3vuo9",
      ],
      syncImmediately: true,
    });
    console.log(res);
  };

  const removeMirrors = async () => {
    const res = await runtimeConnector.removeMirrors({
      did,
      appName,
      mirrorIds: [
        "kjzl6kcym7w8y6obo38hb8k543zk04vsm55mqq2wgcg0wkhqz895b585tw3vuo9",
      ],
      syncImmediately: true,
    });
    console.log(res);
  };

  /*** Folders ***/

  /*** Data Monetize ***/

  const createDatatoken = async () => {
    const res = await runtimeConnector.createDatatoken({
      streamId:
        "kjzl6kcym7w8y6ds8izvyh2shsxkihazva6chw8m2aa158gx0w4i71y263uc4v7",
      collectLimit: 100,
      amount: 0.0001,
      currency: Currency.WMATIC,
    });
    console.log(res);
  };

  const collect = async () => {
    const datatokenId = "0x56E6129a25C59334aB30C962DD84Db7670E964c1";
    const res = await runtimeConnector.collect(datatokenId);
    console.log(res);
  };

  const isCollected = async () => {
    const datatokenId = "0xD0f57610CA33A86d1A9C8749CbEa027fDCff3575";
    const address = "0xdC4b09aBf7dB2Adf6C5b4d4f34fd54759aAA5Ccd";
    const res = await runtimeConnector.isCollected({
      datatokenId,
      address,
    });
    console.log(res);
  };
  /*** Data Monetize ***/

  /*** Other ***/

  const migrateOldFolders = async () => {
    const did = await runtimeConnector.connectIdentity({
      wallet: { name: METAMASK, type: CRYPTO_WALLET_TYPE },
      appName: Apps.MigrateOldFolders,
    });
    const res = await runtimeConnector.migrateOldFolders(did);
    console.log(res);
  };

  /*** Other ***/

  return (
    <div className="App">
      <button onClick={connectWallet}>connectWallet</button>
      <button onClick={switchNetwork}>switchNetwork</button>
      <button onClick={connectIdentity}>connectIdentity</button>
      <button onClick={getChainFromDID}>getChainFromDID</button>
      <button onClick={getDIDList}>getDidList</button>
      <button onClick={getCurrentDID}>getCurrentDID</button>
      <button onClick={createNewDID}>createNewDID</button>
      <button onClick={switchDID}>switchDID</button>
      <br />
      <br />
      <button onClick={getAllAppsNames}>getAllAppsNames</button>
      <button onClick={getAllAppsBaseInfo}>getAllAppsBaseInfo</button>
      <button onClick={getAllAppsInfoByDID}>getAllAppsInfoByDID</button>
      <button onClick={getModelIdByAppNameAndModelName}>
        getModelIdByAppNameAndModelName
      </button>
      <button onClick={getAppNameAndModelNameByModelId}>
        getAppNameAndModelNameByModelId
      </button>
      <br />
      <br />
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
      <br />
      <br />
      <button onClick={newLitKey}>newLitKey</button>
      <button onClick={encrypt}>encrypt</button>
      <button onClick={decrypt}>decrypt</button>
      <br />
      <br />
      <button onClick={readOthersFolders}>readOthersFolders</button>
      <button onClick={readMyFolders}>readMyFolders</button>
      <button onClick={createFolder}>createFolder</button>
      <button onClick={changeFolderBaseInfo}>changeFolderBaseInfo</button>
      <button onClick={changeFolderType}>changeFolderType</button>
      <button onClick={deleteFolder}>deleteFolder</button>
      <button onClick={deleteAllFolder}>deleteAllFolder</button>
      <button onClick={addMirrors}>addMirrors</button>
      <button onClick={updateMirror}>updateMirror</button>
      <button onClick={moveMirrors}>moveMirrors</button>
      <button onClick={removeMirrors}>removeMirrors</button>
      <br />
      <br />
      <button onClick={createDatatoken}>createDatatoken</button>
      <button onClick={collect}>collect</button>
      <button onClick={isCollected}>isCollected</button>
      <br />
      <br />
      <button onClick={migrateOldFolders}>migrateOldFolders</button>
    </div>
  );
}

export default App;
