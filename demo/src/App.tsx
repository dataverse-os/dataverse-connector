import "./App.css";
import React, { useState } from "react";
import {
  RuntimeConnector,
  Extension,
  METAMASK,
  CRYPTO_WALLET_TYPE,
  Apps,
  FolderType,
  StreamObject,
  FileType,
  MirrorFile,
  StructuredFolders,
  Currency,
  Mode,
  CRYPTO_WALLET,
} from "@dataverse/runtime-connector";
import { getAddressFromPkh } from "./utils/addressAndPkh";

const runtimeConnector = new RuntimeConnector(Extension);
const app = "fxy001"; //fxy001 test001
const slug = "fxy001";
export const modelName = `${slug.toLowerCase()}_post`;
export const modelNames = [modelName];
const postVersion = "0.0.1";
const walletName = (localStorage.getItem("walletName") as any) || METAMASK;
const cryptoWalletType = CRYPTO_WALLET_TYPE;
const modelId =
  "kjzl6hvfrbw6c7gkypf9654o0vu1jd1q85fcnyrpc1koobuys71zhp0m7kbmrvs";
//kjzl6hvfrbw6c7gkypf9654o0vu1jd1q85fcnyrpc1koobuys71zhp0m7kbmrvs
//kjzl6hvfrbw6c9k5a5v8gph1asovcygtq10fhuhp96q527ss6czmy95eclkdhxo

function App() {
  const [address, setAddress] = useState("");
  const [wallet, setWallet] = useState<CRYPTO_WALLET>({
    name: walletName,
    type: cryptoWalletType,
  });
  const [pkh, setPkh] = useState("");
  const [chain, setChain] = useState<string>("");
  const [newPkh, setNewPkh] = useState<string>("");
  const [pkhList, setPkhList] = useState<Array<string>>([]);
  const [currentPkh, setCurrentPkh] = useState("");
  const [isCurrentPkhValid, setIsCurrentPkhValid] = useState<boolean>();
  const [appList, setAppList] = useState<string[]>([]);

  const [profileStreamObject, setProfileStreamObject] =
    useState<StreamObject>();
  const [mirrorFile, setMirrorFile] = useState<MirrorFile>();
  const [folderId, setFolderId] = useState("");
  const [folders, setFolders] = useState<StructuredFolders>({});
  const [walletChanged, setWalletChanged] = useState<boolean>(false);

  /*** Wallet ***/

  const selectWallet = async () => {
    const wallet = await runtimeConnector.selectWallet();
    localStorage.setItem("walletName", wallet.name);
    setWallet(wallet);
    setWalletChanged(true);
    console.log({ wallet });
    return wallet;
  };

  const connectWallet = async () => {
    try {
      const address = await runtimeConnector.connectWallet(wallet);
      setAddress(address);
      console.log({ address });
      return address;
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentWallet = async () => {
    const res = await runtimeConnector.getCurrentWallet();
    console.log(res);
    return res;
  };

  const switchNetwork = async () => {
    const res = await runtimeConnector.switchNetwork(137);
    console.log({ res });
  };

  // const ethereumRequest = async () => {
  //   const address = await connectWallet();
  //   const res = await runtimeConnector.ethereumRequest({
  //     method: "eth_sendTransaction",
  //     params: [
  //       {
  //         from: address, // The user's active address.
  //         to: address, // Required except during contract publications.
  //         value: "0xE8D4A50FFD41E", // Only required to send ether to the recipient from the initiating external account.
  //         // gasPrice: "0x09184e72a000", // Customizable by the user during MetaMask confirmation.
  //         // gas: "0x2710", // Customizable by the user during MetaMask confirmation.
  //       },
  //     ],
  //   });
  //   console.log({ res });
  // };

  const sign = async () => {
    await connectWallet();

    const res = await runtimeConnector.sign({
      method: "signMessage",
      params: ["test"],
    });
    console.log({ res });
  };

  const contractCall = async () => {
    await connectWallet();

    await runtimeConnector.switchNetwork(80001);

    const res = await runtimeConnector.contractCall({
      contractAddress: "0xB07E79bB859ad18a8CbE6E111f4ad0Cca2FD3Da8",
      abi: [
        {
          inputs: [],
          name: "metadata",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "hub",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "profileId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "pubId",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "collectModule",
                  type: "address",
                },
              ],
              internalType: "struct IDataToken.Metadata",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      method: "metadata",
      params: [],
      mode: Mode.Read,
    });
    console.log({ res });
  };

  /*** Wallet ***/

  /*** Identity ***/

  const createCapibility = async () => {
    // await connectWallet();
    // // await switchNetwork();
    const pkh = await runtimeConnector.createCapibility({
      wallet,
      app,
    });
    setPkh(pkh);
    console.log({ pkh });
    return pkh;
  };

  const checkCapibility = async () => {
    const isCurrentPkhValid = await runtimeConnector.checkCapibility(app);
    console.log(isCurrentPkhValid);
    setIsCurrentPkhValid(isCurrentPkhValid);
  };

  const getCurrentPkh = async () => {
    const res = await runtimeConnector.wallet.getCurrentPkh();
    console.log(res);
    setCurrentPkh(res);
  };

  const getChainFromPkh = async () => {
    const chain = await runtimeConnector.wallet.getChainFromPkh(
      "did:pkh:eip155:137:0x3c6216caE32FF6691C55cb691766220Fd3f55555"
    );
    console.log({ chain });
    setChain(chain);
  };

  const getPkhList = async () => {
    const pkhList = await runtimeConnector.wallet.getPkhList();
    console.log({ pkhList });
    setPkhList(pkhList);
  };

  const getWalletByPkh = async () => {
    try {
      const wallet = await runtimeConnector.wallet.getWalletByPkh(
        "did:pkh:eip155:137:0xd10d5b408A290a5FD0C2B15074995e899E944444"
      );
      console.log({ wallet });
    } catch (error) {
      console.log(error);
    }
  };

  const createNewPkh = async () => {
    try {
      const { currentPkh, createdPkhList } =
        await runtimeConnector.wallet.createNewPkh(wallet);
      setNewPkh(currentPkh);
      console.log({ currentPkh, createdPkhList });
    } catch (error) {
      console.log({ error });
    }
  };

  const switchPkh = async () => {
    try {
      const res = await runtimeConnector.wallet.switchPkh(
        "did:pkh:eip155:137:0xd10d5b408A290a5FD0C2B15074995e899E944444"
      );
      console.log(res);
    } catch (error) {
      console.log({ error });
    }
  };

  /*** Identity ***/

  /*** APP Registry ***/

  const getDAppTable = async () => {
    const appsInfo = await runtimeConnector.getDAppTable();
    console.log({ appsInfo });
    setAppList(Object.keys(appsInfo));
  };

  const getDAppInfo = async () => {
    const appsInfo = await runtimeConnector.getDAppInfo(Apps.Dataverse);
    console.log(appsInfo);
  };

  const getValidAppCaps = async () => {
    const appsInfo = await runtimeConnector.getValidAppCaps();
    console.log(appsInfo);
  };

  const getModelBaseInfo = async () => {
    const res = await runtimeConnector.getModelBaseInfo(
      "kjzl6hvfrbw6c9k5a5v8gph1asovcygtq10fhuhp96q527ss6czmy95eclkdhxo"
    );
    console.log(res);
  };

  /*** APP Registry ***/

  /*** Post ***/
  const loadStream = async () => {
    const stream = await runtimeConnector.loadStream({
      app: "test001",
      streamId:
        "kjzl6kcym7w8yafvxqtfrbzl70mcphjrt1fxqsvfnz0icroykmf22enl2mz9eet",
    });
    console.log(stream);
  };

  const loadStreamsBy = async () => {
    const streams = await runtimeConnector.loadStreamsBy({
      modelId:
        "kjzl6hvfrbw6c9k5a5v8gph1asovcygtq10fhuhp96q527ss6czmy95eclkdhxo",
      pkh: "did:pkh:eip155:137:0x5915e293823FCa840c93ED2E1E5B4df32d699999",
    });
    console.log(streams);
    // const res = Object.values(streams).filter(
    //   (el) => el.controller !== pkh && el.fileType === FileType.Datatoken
    // );
    // console.log(res);
  };

  const createPublicPostStream = async () => {
    const date = new Date().toISOString();

    const encrypted = JSON.stringify({
      text: false,
      images: false,
      videos: false,
    });

    const { streamContent, streamId, newFile, existingFile } =
      await runtimeConnector.createStream({
        modelId,
        streamContent: {
          appVersion: postVersion,
          text: "hello",
          images: [
            "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
          ],
          videos: [],
          createdAt: date,
          updatedAt: date,
          encrypted,
        },
      });

    if (!newFile && !existingFile) {
      throw "Failed to create content";
    }

    (existingFile || newFile)!.content = streamContent;

    const contentObject = {
      content: (existingFile || newFile)!,
      contentId: streamId,
    };

    console.log(contentObject);
    return contentObject;
  };

  const createPrivatePostStream = async () => {
    const date = new Date().toISOString();

    const encrypted = JSON.stringify({
      text: true,
      images: true,
      videos: false,
    });

    const res = await runtimeConnector.createStream({
      modelId,
      streamContent: {
        appVersion: postVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        ],
        videos: [],
        createdAt: date,
        updatedAt: date,
        encrypted,
      },
    });

    console.log(res);
  };

  const createDatatokenPostStream = async () => {
    const pkh = await runtimeConnector.createCapibility({ app, wallet });

    const profileId = await getProfileId({ pkh, lensNickName: "hello123" });

    const date = new Date().toISOString();

    const res2 = await createPublicPostStream();

    res2.content.content = {
      appVersion: postVersion,
      text: "metaverse",
      images: [
        "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link/",
      ],
      videos: [],
      createdAt: date,
      updatedAt: date,
    };

    return monetizeContent({
      pkh,
      lensNickName: "hello", //Only supports lower case characters, numbers, must be minimum of 5 length and maximum of 26 length
      contentId: res2.contentId,
      mirrorFile: res2.content,
      profileId,
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
      currency: Currency.WMATIC,
      amount: 0.0001,
      collectLimit: 1000,
    });
  };

  const getProfileId = async ({
    pkh,
    lensNickName,
  }: {
    pkh: string;
    lensNickName?: string;
  }) => {
    const lensProfiles = await runtimeConnector.getProfiles(
      getAddressFromPkh(pkh)
    );

    let profileId;
    if (lensProfiles?.[0]?.id) {
      profileId = lensProfiles?.[0]?.id;
    } else {
      if (!lensNickName) {
        throw "Please pass in lensNickName";
      }
      if (!/^[\da-z]{5,26}$/.test(lensNickName) || lensNickName.length > 26) {
        throw "Only supports lower case characters, numbers, must be minimum of 5 length and maximum of 26 length";
      }
      profileId = await runtimeConnector.createProfile(lensNickName);
    }

    return profileId;
  };

  const monetizePost = async () => {
    const contentId =
      "kjzl6kcym7w8y9oulzcg8vwtqk0wmqt2ry7u7oludzixy5f110bzxx5cbmuoffn";

    const pkh = await runtimeConnector.createCapibility({ app, wallet });

    const res = await monetizeContent({
      pkh,
      contentId,
      lensNickName: "hello", //Only supports lower case characters, numbers, must be minimum of 5 length and maximum of 26 length
      currency: Currency.WMATIC,
      amount: 0.0001,
      collectLimit: 1000,
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
    });
    console.log(res);
  };

  const monetizeContent = async ({
    pkh,
    contentId,
    lensNickName,
    profileId,
    mirrorFile,
    encrypted,
    currency,
    amount,
    collectLimit,
  }: {
    pkh: string;
    contentId: string;
    lensNickName?: string;
    mirrorFile?: MirrorFile;
    profileId?: string;
    encrypted: object;
    currency: Currency;
    amount: number;
    collectLimit: number;
  }) => {
    if (!profileId) {
      profileId = await getProfileId({ pkh, lensNickName });
    }
    if (!mirrorFile) {
      const res = await runtimeConnector.loadStream({
        app,
        streamId: contentId,
      });
      mirrorFile = res.streamContent;
    }

    try {
      await runtimeConnector.switchNetwork(80001);
      await runtimeConnector.monetizeFile({
        app,
        indexFileId: mirrorFile!.indexFileId,
        datatokenVars: {
          profileId,
          currency,
          amount,
          collectLimit,
        },
      });
    } catch (error: any) {
      console.log(error);
      if (
        error !==
        "networkConfigurationId undefined does not match a configured networkConfiguration"
      ) {
        await deletePost({ pkh, content: mirrorFile! });
      }
      throw error;
    }

    (mirrorFile!.content as { encrypted: string }).encrypted =
      JSON.stringify(encrypted);
    (mirrorFile!.content as { updatedAt: string }).updatedAt =
      new Date().toISOString();

    const res = await runtimeConnector.updateStream({
      app,
      streamId: contentId,
      streamContent: mirrorFile!.content,
      syncImmediately: true,
    });

    return res;
  };

  const updatePostFromPublicToPrivate = async () => {
    const contentId =
      "kjzl6kcym7w8y5ieh12ywk2d248xjn2tke5si45s6xeg8ka7uibrav53przbffp";

    const encrypted = JSON.stringify({
      text: true,
      images: true,
      videos: false,
    });

    const res = await runtimeConnector.updateStream({
      app,
      streamId: contentId,
      streamContent: {
        encrypted,
      },
      syncImmediately: true,
    });

    console.log(res);
  };

  const updatePublicContent = async () => {
    const contentId =
      "kjzl6kcym7w8y69ar71y7owfizordoq3g4ancmlqmjg9x6q3cff9nqdjizsy4rt";

    const encrypted = JSON.stringify({
      text: false,
      images: false,
      videos: false,
    });

    const res = await runtimeConnector.updateStream({
      app,
      streamId: contentId,
      streamContent: {
        text: "update my post -- " + new Date().toISOString(),
        images: [
          "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link",
        ],
        encrypted,
      },
      syncImmediately: true,
    });

    console.log(res);
  };

  const updatePrivateOrDatatokenContent = async () => {
    const contentId =
      "kjzl6kcym7w8y6qray87uwcsc68vpq5omefq5ydfv4rpxzafdtykkbag1jnet27";

    const encrypted = JSON.stringify({
      text: true,
      images: true,
      videos: false,
    });

    const res = await runtimeConnector.updateStream({
      app,
      streamId: contentId,
      streamContent: {
        text: "update my post -- " + new Date().toISOString(),
        images: [
          "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link",
        ],
        encrypted,
      },
      syncImmediately: true,
    });

    console.log(res);
  };

  const deletePost = async ({
    content,
  }: {
    pkh: string;
    content: MirrorFile;
  }) => {
    const res = await runtimeConnector.removeFiles({
      app,
      indexFileIds: [content.indexFileId],
    });
    return res;
  };

  /*** Post ***/

  /*** Folders ***/
  const readFolders = async () => {
    const folders = await runtimeConnector.readFolders(app);
    console.log({ folders });
    return folders;
  };

  const createFolder = async () => {
    const res = await runtimeConnector.createFolder({
      app,
      folderType: FolderType.Private,
      folderName: "Private",
    });
    console.log(res);
    setFolderId(res.newFolder.folderId);
    console.log(res.newFolder.folderId);
  };

  const updateFolderBaseInfo = async () => {
    const res = await runtimeConnector.updateFolderBaseInfo({
      app,
      folderId:
        "kjzl6kcym7w8y9k8byiqo3p1ydrpgopncdamqp9yanzus7duyxj1x07ms1cc6wi",
      newFolderName: new Date().toISOString(),
      newFolderDescription: new Date().toISOString(),
      // syncImmediately: true,
    });
    console.log(res);
  };

  const changeFolderType = async () => {
    const res = await runtimeConnector.changeFolderType({
      app,
      folderId,
      targetFolderType: FolderType.Public,
      // syncImmediately: true,
    });
    console.log(res);
  };

  const deleteFolder = async () => {
    const res = await runtimeConnector.deleteFolder({
      app,
      folderId:
        "kjzl6kcym7w8y6pjw6yjnr9hbkeh025jrwe4hoqfscrwmpn6bx064rywv8qxavl",
      syncImmediately: true,
    });
    console.log(res);
  };

  const deleteAllFolder = async () => {
    const folders = await runtimeConnector.readFolders(app);
    await Promise.all(
      Object.keys(folders).map((folderId) =>
        runtimeConnector.deleteFolder({
          app,
          folderId,
          syncImmediately: true,
        })
      )
    );
    readFolders();
  };

  const monetizeFolder = async () => {
    const res = await runtimeConnector.monetizeFolder({
      app,
      folderId:
        "kjzl6kcym7w8y7k2u3s9euekveiao5u386qxnpe51g6zpqds1kdsn6kdoivu6sh",
      folderDescription: "This is a datatoken folder.",
      datatokenVars: {
        profileId: "0x0219",
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
  const uploadFile = async () => {
    const res = await runtimeConnector.uploadFile({
      app,
      folderId:
        "kjzl6kcym7w8y7k2u3s9euekveiao5u386qxnpe51g6zpqds1kdsn6kdoivu6sh",
      // contentId: "bafybeibsels6lnv7pcoyh4v3diezwm5v7lmp2yezkzczk3hl22hvmhgmwq",
      // contentType: IndexFileContentType.CID,
      // fileType: FileType.Private,
      // mirrorName: "BSC_logo.png",
      // originDate: new Date().toISOString(),
      // originType: OriginType.upload,
      // originURL: "https://dataverse-os.com",

      syncImmediately: true,
    });
    console.log(res);
  };

  const updateFileBaseInfo = async () => {
    const res = await runtimeConnector.updateFileBaseInfo({
      app,
      indexFileId:
        "kjzl6kcym7w8y6obo38hb8k543zk04vsm55mqq2wgcg0wkhqz895b585tw3vuo9",
      fileInfo: {
        fileType: FileType.Public,
      },
      syncImmediately: true,
    });
    console.log(res);
  };

  const moveFiles = async () => {
    const res = await runtimeConnector.moveFiles({
      app,
      targetFolderId:
        "kjzl6kcym7w8y94clt1zso1lov99lhu14q0fr2vl8i1nn55slrz47dvqix0it6o",
      sourceIndexFileIds: [
        "kjzl6kcym7w8y6obo38hb8k543zk04vsm55mqq2wgcg0wkhqz895b585tw3vuo9",
      ],
      syncImmediately: true,
    });
    console.log(res);
  };

  const removeFiles = async () => {
    const res = await runtimeConnector.removeFiles({
      app,
      indexFileIds: [
        "kjzl6kcym7w8y62b7739cc4tz98zrva0se6z3qyins6a8cxfaepgek5zskg0iiq",
        "kjzl6kcym7w8y5gwiglq0ic82705yzb4yve3741b6pnekno8ntsvh7hejxhy7c4",
      ],
      syncImmediately: true,
    });
    console.log(res);
  };

  const monetizeFile = async () => {
    const res = await runtimeConnector.monetizeFile({
      app,
      indexFileId:
        "kjzl6kcym7w8y8chugqcvqoox6nnxaf0hhofv587ba99kioz9089ofjnsrgtvyr",
      datatokenVars: {
        profileId: "0x0219",
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
  const createProfile = async () => {
    await runtimeConnector.switchNetwork(80001);
    const res = await runtimeConnector.createProfile("test6");
    console.log(res);
  };

  const getProfiles = async () => {
    const res = await runtimeConnector.getProfiles(
      "0xA48077Ef4680334dc573B3A9322d350d7a27709d"
    );
    console.log(res);
  };

  const collect = async () => {
    await runtimeConnector.switchNetwork(80001);
    const res = await runtimeConnector.collect({
      app,
      indexFileId:
        "kjzl6kcym7w8y65io6cihifwm4yqx9ochcaoq0934yeivmmbkht7cj780fxq7zo",
    });
    console.log(res);
  };

  const isCollected = async () => {
    await runtimeConnector.switchNetwork(80001);
    const datatokenId = "0xD0f57610CA33A86d1A9C8749CbEa027fDCff3575";
    const address = "0xdC4b09aBf7dB2Adf6C5b4d4f34fd54759aAA5Ccd";
    const res = await runtimeConnector.isCollected({
      datatokenId,
      address,
    });
    console.log(res);
  };

  const getDatatokenMetadata = async () => {
    await runtimeConnector.switchNetwork(80001);
    const datatokenId = "0xD0f57610CA33A86d1A9C8749CbEa027fDCff3575";
    const res = await runtimeConnector.getDatatokenMetadata(datatokenId);
    console.log(res);
  };

  const unlock = async () => {
    const indexFileId =
      "kjzl6kcym7w8yaz13rj23ehtiudufl5aauuzypob3159vv7q1qmkgrd214n64hv";
    const res = await runtimeConnector.unlock({ app, indexFileId });
    console.log(res);
  };
  /*** Data Monetize ***/

  return (
    <div className="App">
      <button onClick={selectWallet}>selectWallet</button>
      <div className="blackText">
        {!walletChanged && "default: "}
        {wallet?.name}
      </div>
      <hr />
      <button onClick={connectWallet}>connectWallet</button>
      <div className="blackText">{address}</div>
      <hr />
      <button onClick={getCurrentWallet}>getCurrentWallet</button>
      <hr />
      <button onClick={switchNetwork}>switchNetwork</button>
      <hr />
      <button onClick={sign}>sign</button>
      <hr />
      <button onClick={contractCall}>contractCall</button>
      <hr />
      <button onClick={createCapibility}>createCapibility</button>
      <div className="blackText">{pkh}</div>
      <hr />
      <button onClick={checkCapibility}>checkCapibility</button>
      <div className="blackText">
        {isCurrentPkhValid !== undefined && String(isCurrentPkhValid)}
      </div>
      <hr />
      <button onClick={getChainFromPkh}>getChainFromPkh</button>
      <div className="blackText">{chain}</div>
      <hr />
      <button onClick={getPkhList}>getPkhList</button>
      {pkhList.map((pkh) => (
        <div className="blackText" key={pkh}>
          {pkh}
        </div>
      ))}
      <hr />
      <button onClick={getCurrentPkh}>getCurrentPkh</button>
      <div className="blackText">{currentPkh}</div>
      <hr />
      <button onClick={getWalletByPkh}>getWalletByPkh</button>
      <hr />
      <button onClick={createNewPkh}>createNewPkh</button>
      <div className="blackText">{newPkh}</div>
      <hr />
      <button onClick={switchPkh}>switchPkh</button>
      <br />
      <br />
      <button onClick={getDAppTable}>getDAppTable</button>
      {appList.map((app) => (
        <div className="blackText" key={app}>
          {app}
        </div>
      ))}
      <hr />
      <button onClick={getDAppInfo}>getDAppInfo</button>
      <button onClick={getValidAppCaps}>getValidAppCaps</button>
      <button onClick={getModelBaseInfo}>getModelBaseInfo</button>
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
      <button onClick={loadStreamsBy}>loadStreamsBy</button>
      <button onClick={createPublicPostStream}>createPublicPostStream</button>
      <button onClick={createPrivatePostStream}>createPrivatePostStream</button>
      <button onClick={createDatatokenPostStream}>
        createDatatokenPostStream
      </button>
      <button onClick={monetizePost}>monetizePost</button>
      <button onClick={updatePostFromPublicToPrivate}>
        updatePostFromPublicToPrivate
      </button>
      <button onClick={updatePublicContent}>updatePublicContent</button>
      <button onClick={updatePrivateOrDatatokenContent}>
        updatePrivateOrDatatokenContent
      </button>
      <br />
      <br />
      <button onClick={readFolders}>readFolders</button>
      <button onClick={createFolder}>createFolder</button>
      <button onClick={updateFolderBaseInfo}>updateFolderBaseInfo</button>
      <button onClick={changeFolderType}>changeFolderType</button>
      <button onClick={deleteFolder}>deleteFolder</button>
      <button onClick={deleteAllFolder}>deleteAllFolder</button>
      <button onClick={monetizeFolder}>monetizeFolder</button>

      <button onClick={uploadFile}>uploadFile</button>
      <button onClick={updateFileBaseInfo}>updateFileBaseInfo</button>
      <button onClick={moveFiles}>moveFiles</button>
      <button onClick={removeFiles}>removeFiles</button>
      <button onClick={monetizeFile}>monetizeFile</button>
      <br />
      <br />
      <button onClick={createProfile}>createProfile</button>
      <button onClick={getProfiles}>getProfiles</button>
      <button onClick={collect}>collect</button>
      <button onClick={isCollected}>isCollected</button>
      <button onClick={getDatatokenMetadata}>getDatatokenMetadata</button>
      <button onClick={unlock}>unlock</button>
      <br />
      <br />
    </div>
  );
}

export default App;
