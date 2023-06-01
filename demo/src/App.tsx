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
  UploadProviderName,
  DecryptionConditions,
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
const uploadProvider = {
  name: UploadProviderName.Lighthouse,
  apiKey: "", // input your api key to call uploadFile successfully
};

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
      console.error(error);
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

  const ethereumRequest = async () => {
    const address = await connectWallet();
    const res = await runtimeConnector.ethereumRequest({
      method: "eth_sendTransaction",
      params: [
        {
          from: address, // The user's active address.
          to: address, // Required except during contract publications.
          value: "0xE8D4A50FFD41E", // Only required to send ether to the recipient from the initiating external account.
          // gasPrice: "0x09184e72a000", // Customizable by the user during MetaMask confirmation.
          // gas: "0x2710", // Customizable by the user during MetaMask confirmation.
        },
      ],
    });
    console.log({ res });
  };

  const getCurrentPkh = async () => {
    const res = await runtimeConnector.wallet.getCurrentPkh();
    console.log(res);
    setCurrentPkh(res);
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
      console.error(error);
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
  /*** Wallet ***/

  /*** DApp ***/
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
  /*** DApp ***/

  /*** Stream ***/
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

  const loadStream = async () => {
    const stream = await runtimeConnector.loadStream({
      app: "test001",
      streamId:
        "kjzl6kcym7w8ya8g9cj5764kll6veldqws40ub29r1odut2pxiqxet80sl9p6th",
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

  const createStream = async () => {
    const date = new Date().toISOString();

    const encrypted = JSON.stringify({
      text: false,
      images: false,
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

  const updateStream = async () => {
    const date = new Date().toISOString();

    const encrypted = JSON.stringify({
      text: true,
      images: true,
      videos: false,
    });

    const res = await runtimeConnector.updateStream({
      streamId:
        "kjzl6kcym7w8y69ar71y7owfizordoq3g4ancmlqmjg9x6q3cff9nqdjizsy4rt",
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
  /*** Stream ***/

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
        "kjzl6kcym7w8y7qh3z3ycahc1gdvz1um6l3ai4x75bzeeupprwis05plzzlf023",
      newFolderName: new Date().toISOString(),
      newFolderDescription: new Date().toISOString(),
      // syncImmediately: true,
    });
    console.log(res);
  };

  const changeFolderType = async () => {
    const res = await runtimeConnector.changeFolderType({
      app,
      folderId:
        "kjzl6kcym7w8y7qh3z3ycahc1gdvz1um6l3ai4x75bzeeupprwis05plzzlf023",
      targetFolderType: FolderType.Public,
      // syncImmediately: true,
    });
    console.log(res);
  };

  const deleteFolder = async () => {
    const res = await runtimeConnector.deleteFolder({
      app,
      folderId:
        "kjzl6kcym7w8y7qh3z3ycahc1gdvz1um6l3ai4x75bzeeupprwis05plzzlf023",
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
    const pkh = await runtimeConnector.createCapibility({ app, wallet });

    const profileId = await getProfileId({ pkh, lensNickName: "hello123" });

    const res = await runtimeConnector.monetizeFolder({
      app,
      folderId:
        "kjzl6kcym7w8y7qh3z3ycahc1gdvz1um6l3ai4x75bzeeupprwis05plzzlf023",
      folderDescription: "This is a datatoken folder.",
      datatokenVars: {
        profileId,
        collectLimit: 100,
        amount: 0.0001,
        currency: Currency.WMATIC,
      },
    });
    console.log(res);
    return res;
  };
  /*** Folders ***/

  /*** Files ***/
  const uploadFile = async (event: any) => {
    try {
      await createCapibility();

      const file = event.target.files[0];
      console.log(file);
      const fileName = file.name;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      const fileBase64: string = await new Promise((resolve) => {
        reader.addEventListener("load", async (e: any) => {
          resolve(e.target.result);
        });
      });

      console.log(fileBase64);

      const res = await runtimeConnector.uploadFile({
        app,
        folderId:
          "kjzl6kcym7w8y9rs0bzdj838kejq72e0otx6c31q6yhfw6j8ubvns1mmt9wpnzy",
        fileBase64,
        fileName,
        encrypted: false,
        uploadProvider,
        syncImmediately: true,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const updateFileBaseInfo = async () => {
    const res = await runtimeConnector.updateFileBaseInfo({
      app,
      indexFileId:
        "kjzl6kcym7w8y66naus0ftsgj6gpc0tcm8za7h4u96tq5z2cj137yam74bwvhpq",
      fileInfo: {
        mirrorName: "aaa",
      },
      syncImmediately: true,
    });
    console.log(res);
  };

  const moveFiles = async () => {
    const res = await runtimeConnector.moveFiles({
      app,
      targetFolderId:
        "kjzl6kcym7w8y74i4y8nuh2buw2g95fh7yxrzfs41h07at1bf9p80hpc2018er1",
      sourceIndexFileIds: [
        "kjzl6kcym7w8y66naus0ftsgj6gpc0tcm8za7h4u96tq5z2cj137yam74bwvhpq",
        "kjzl6kcym7w8y9vo1yy7uoz9zbiqspcxxgx1lbfxrhqsdd84cwejpfowdrekkul",
      ],
      syncImmediately: true,
    });
    console.log(res);
  };

  const removeFiles = async () => {
    const res = await runtimeConnector.removeFiles({
      app,
      indexFileIds: [
        "kjzl6kcym7w8y7owefxq7at6tyqspgv6m67c94max7jlgi7goz8m64119s5xtu6",
      ],
      syncImmediately: true,
    });
    console.log(res);
    HTMLHRElement;
  };

  const monetizeFile = async () => {
    try {
      const pkh = await runtimeConnector.createCapibility({ app, wallet });

      const profileId = await getProfileId({ pkh, lensNickName: "hello123" });

      const res = await runtimeConnector.monetizeFile({
        app,
        // streamId:
        //   "kjzl6kcym7w8y8j54sv8p4l8daxbj571b1emd8a3v5s2r9afm6di17hffmaa15t",
        indexFileId:
          "kjzl6kcym7w8y95pg3pskvbn81qedyf0htw12g6donw105dufu6atjqfoi9t57a",
        datatokenVars: {
          profileId,
          collectLimit: 100,
          amount: 0.0001,
          currency: Currency.WMATIC,
        },
        uploadProvider,
      });
      console.log(res);
      return res;
    } catch (error) {
      console.error(error);
    }
  };
  /*** Files ***/

  /*** Monetize ***/
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

  const unlock = async () => {
    try {
      await createCapibility();
      const streamId =
        "kjzl6kcym7w8y808e1c24rmozejq2yjhs6rqi3y9p2mmhst9x7wy5muockde39b";
      // const indexFileId =
      //   "kjzl6kcym7w8y8k0cbuzlcrd78o1jpjohqj6tnrakwdq0vklbek5nhj55g2c4se";
      const res = await runtimeConnector.unlock({ app, streamId });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
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
  /*** Monetize ***/

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
      <button onClick={ethereumRequest}>ethereumRequest</button>
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
      <button onClick={createCapibility}>createCapibility</button>
      <div className="blackText">{pkh}</div>
      <hr />
      <button onClick={checkCapibility}>checkCapibility</button>
      <div className="blackText">
        {isCurrentPkhValid !== undefined && String(isCurrentPkhValid)}
      </div>
      <hr />
      <button onClick={loadStream}>loadStream</button>
      <button onClick={loadStreamsBy}>loadStreamsBy</button>
      <button onClick={createStream}>createStream</button>
      <button onClick={updateStream}>updateStream</button>
      <br />
      <br />
      <button onClick={readFolders}>readFolders</button>
      <button onClick={createFolder}>createFolder</button>
      <button onClick={updateFolderBaseInfo}>updateFolderBaseInfo</button>
      <button onClick={changeFolderType}>changeFolderType</button>
      <button onClick={deleteFolder}>deleteFolder</button>
      <button onClick={deleteAllFolder}>deleteAllFolder</button>
      <button onClick={monetizeFolder}>monetizeFolder</button>
      <br />
      <br />
      <button>
        <span>uploadFile</span>
        <input
          type="file"
          onChange={uploadFile}
          name="uploadFile"
          style={{ width: "168px", marginLeft: "10px" }}
        />
      </button>

      <button onClick={updateFileBaseInfo}>updateFileBaseInfo</button>
      <button onClick={moveFiles}>moveFiles</button>
      <button onClick={removeFiles}>removeFiles</button>
      <button onClick={monetizeFile}>monetizeFile</button>
      <br />
      <br />
      <button onClick={createProfile}>createProfile</button>
      <button onClick={getProfiles}>getProfiles</button>
      <button onClick={unlock}>unlock</button>
      <button onClick={isCollected}>isCollected</button>
      <button onClick={getDatatokenMetadata}>getDatatokenMetadata</button>
      <br />
      <br />
    </div>
  );
}

export default App;
