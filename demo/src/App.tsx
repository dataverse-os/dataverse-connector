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
  DatatokenVars,
} from "@dataverse/runtime-connector";

// import { DataverseKernel } from "@dataverse/dataverse-kernel";
// DataverseKernel.init();
const runtimeConnector = new RuntimeConnector(Extension);
const appName = Apps.Playground;
const modelName = ModelNames.post;
const modelNames = [ModelNames.post];

function App() {
  const [address, setAddress] = useState("");
  const [did, setDid] = useState("");
  const [chain, setChain] = useState<string>("");
  const [newDid, setNewDid] = useState("");
  const [didList, setDidList] = useState<Array<string>>([]);
  const [currentDid, setCurrentDid] = useState("");
  const [isCurrentDIDValid, setIsCurrentDIDValid] = useState<boolean>();
  const [appNameList, setAppNameList] = useState<string[]>([]);

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
      console.log({ address });
    } catch (error) {
      console.log(error);
    }
  };

  const switchNetwork = async () => {
    const res = await runtimeConnector.switchNetwork(137);
    console.log({ res });
  };

  const connectIdentity = async () => {
    await connectWallet();
    await switchNetwork();
    const did = await runtimeConnector.connectIdentity({
      wallet: { name: METAMASK, type: CRYPTO_WALLET_TYPE },
      appName,
    });
    setDid(did);
    console.log({ did });
    return did;
  };

  const getCurrentDID = async () => {
    const res = await runtimeConnector.getCurrentDID();
    console.log(res);
    setCurrentDid(res);
  };

  const checkIsCurrentDIDValid = async () => {
    const isCurrentDIDValid = await runtimeConnector.checkIsCurrentDIDValid({
      appName,
    });
    console.log(isCurrentDIDValid);
    setIsCurrentDIDValid(isCurrentDIDValid);
  };

  const getChainFromDID = async () => {
    const chain = await runtimeConnector.getChainFromDID(
      "did:pkh:eip155:137:0x3c6216caE32FF6691C55cb691766220Fd3f55555"
    );
    console.log({ chain });
    setChain(chain);
  };

  const getDIDList = async () => {
    const didList = await runtimeConnector.getDIDList();
    console.log({ didList });
    setDidList(didList);
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
    console.log({ appsInfo });
    setAppNameList(appsInfo);
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
  const loadOthersProfileStreamsByModelAndDID = async () => {
    const streams = await runtimeConnector.loadStreamsByModelAndDID({
      did: "did:pkh:eip155:137:0x8A9800738483e9D42CA377D8F95cc5960e6912d1",
      appName,
      modelName: ModelNames.userProfile,
    });
    console.log(streams);
    const [streamId, streamContent] = Object.entries(streams)[0];
    setProfileStreamObject({ streamId, streamContent });
  };
  const loadMyProfileStreamsByModelAndDID = async () => {
    const streams = await runtimeConnector.loadStreamsByModelAndDID({
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
      "kjzl6kcym7w8y6qbarydazjfk7aq8agx9vece4dxvwzc2d3ku4xfuq9g2degpv3"
    );
    console.log(stream);
  };

  const loadStreamsByModel = async () => {
    const streams = await runtimeConnector.loadStreamsByModel({
      appName,
      modelName,
    });
    console.log(streams);
    const res = Object.values(streams).filter(
      (el) => el.controller !== did && el.fileType === FileType.Datatoken
    );
    console.log(res);
  };

  const loadStreamsByModelAndDID = async () => {
    const streams = await runtimeConnector.loadStreamsByModelAndDID({
      did: "did:pkh:eip155:137:0x40AAD5b393388534b1598CAa54c09E9623D87C7f",
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
          syncImmediately: true,
        })
      )
    );
    readMyFolders();
  };

  const monetizeFolder = async () => {
    const res = await runtimeConnector.monetizeFolder({
      did,
      appName,
      folderId:
        "kjzl6kcym7w8y9nu1kxk4h4c59wjhue7s2aah0jvlaeye10dajwfn9d0aa1t3s1",
      folderDescription: "This is a datatoken folder.",
      datatokenVars: {
        streamId:
          "kjzl6kcym7w8y9nu1kxk4h4c59wjhue7s2aah0jvlaeye10dajwfn9d0aa1t3s1",
        collectLimit: 100,
        amount: 0.0001,
        currency: Currency.WMATIC,
      },
    });
    console.log(res);
    return res;
  };
  /*** Folders ***/

  /*** Mirrors ***/
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
        "kjzl6kcym7w8y62b7739cc4tz98zrva0se6z3qyins6a8cxfaepgek5zskg0iiq",
        "kjzl6kcym7w8y5gwiglq0ic82705yzb4yve3741b6pnekno8ntsvh7hejxhy7c4",
      ],
      syncImmediately: true,
    });
    console.log(res);
  };

  const monetizeMirror = async () => {
    const res = await runtimeConnector.monetizeMirror({
      did,
      appName,
      mirrorId:
        "kjzl6kcym7w8y8chugqcvqoox6nnxaf0hhofv587ba99kioz9089ofjnsrgtvyr",
      datatokenVars: {
        streamId:
          "kjzl6kcym7w8y8chugqcvqoox6nnxaf0hhofv587ba99kioz9089ofjnsrgtvyr",
        collectLimit: 100,
        amount: 0.0001,
        currency: Currency.WMATIC,
      },
    });
    console.log(res);
    return res;
  };
  /*** Mirrors ***/

  /*** Data Monetize ***/

  const getChainOfDatatoken = async () => {
    const res = await runtimeConnector.getChainOfDatatoken();
    console.log(res);
  };

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
    const res = await runtimeConnector.collect({
      did,
      appName,
      datatokenId: "0xd1a758326F688fb775999bC5CAc2160fC426Be5f",
      indexFileId:
        "kjzl6kcym7w8y59fy02sqthoahjth6js42g7kj974drvdmeugrmiwa7u67tj223",
    });
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

  const getDatatokenMetadata = async () => {
    const datatokenId = "0xD0f57610CA33A86d1A9C8749CbEa027fDCff3575";
    const res = await runtimeConnector.getDatatokenMetadata(datatokenId);
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
      <div className="blackText">{address}</div>
      <hr />
      <button onClick={switchNetwork}>switchNetwork</button>
      <hr />
      <button onClick={connectIdentity}>connectIdentity</button>
      <div className="blackText">{did}</div>
      <hr />
      <button onClick={getChainFromDID}>getChainFromDID</button>
      <div className="blackText">{chain}</div>
      <hr />
      <button onClick={getDIDList}>getDidList</button>
      {didList.map((did) => (
        <div className="blackText" key={did}>
          {did}
        </div>
      ))}
      <hr />
      <button onClick={getCurrentDID}>getCurrentDID</button>
      <div className="blackText">{currentDid}</div>
      <hr />
      <button onClick={checkIsCurrentDIDValid}>checkIsCurrentDIDValid</button>
      <div className="blackText">
        {isCurrentDIDValid !== undefined && String(isCurrentDIDValid)}
      </div>
      <hr />
      <button onClick={createNewDID}>createNewDID</button>
      <div className="blackText">{newDid}</div>
      <hr />
      <button onClick={switchDID}>switchDID</button>
      <br />
      <br />
      <button onClick={getAllAppsNames}>getAllAppsNames</button>
      {appNameList.map((app) => (
        <div className="blackText" key={app}>
          {app}
        </div>
      ))}
      <hr />
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
      <button onClick={loadStreamsByModel}>loadStreamsByModel</button>
      <button onClick={loadStreamsByModelAndDID}>
        loadStreamsByModelAndDID
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
      <button onClick={monetizeFolder}>monetizeFolder</button>

      <button onClick={addMirrors}>addMirrors</button>
      <button onClick={updateMirror}>updateMirror</button>
      <button onClick={moveMirrors}>moveMirrors</button>
      <button onClick={removeMirrors}>removeMirrors</button>
      <button onClick={monetizeMirror}>monetizeMirror</button>
      <br />
      <br />
      <button onClick={getChainOfDatatoken}>getChainOfDatatoken</button>
      <button onClick={createDatatoken}>createDatatoken</button>
      <button onClick={collect}>collect</button>
      <button onClick={isCollected}>isCollected</button>
      <button onClick={getDatatokenMetadata}>getDatatokenMetadata</button>
      <br />
      <br />
      <button onClick={migrateOldFolders}>migrateOldFolders</button>
    </div>
  );
}

export default App;
