import "./App.css";
import React, { useState } from "react";
import {
  RuntimeConnector,
  Extension,
  Apps,
  FolderType,
  StreamObject,
  FileType,
  MirrorFile,
  StructuredFolders,
  Currency,
  Mode,
  StorageProviderName,
  DecryptionConditions,
  SignMethod,
  WALLET,
} from "@dataverse/runtime-connector";
import { getAddressFromPkh } from "./utils/addressAndPkh";

const runtimeConnector = new RuntimeConnector(Extension);
const app = "fxy001"; //fxy001 test001
const slug = "fxy001";
const postVersion = "0.0.1";
const defaultWallet =
  (localStorage.getItem("walletName") as any) || WALLET.METAMASK;
const modelId =
  "kjzl6hvfrbw6c7gkypf9654o0vu1jd1q85fcnyrpc1koobuys71zhp0m7kbmrvs";

const storageProvider = {
  name: StorageProviderName.Lighthouse,
  apiKey: "9d632fe6.e756cc9797c345dc85595a688017b226", // input your api key to call uploadFile successfully
};

function App() {
  const [address, setAddress] = useState("");
  const [wallet, setWallet] = useState<WALLET>(defaultWallet);
  const [pkh, setPkh] = useState("");
  const [newPkh, setNewPkh] = useState<string>("");
  const [pkhList, setPkhList] = useState<Array<string>>([]);
  const [currentPkh, setCurrentPkh] = useState("");
  const [pkpWallet, setPKPWallet] = useState({
    address: "",
    publicKey: "",
  });
  const [litActionResponse, setLitActionResponse] = useState("");

  const [isCurrentPkhValid, setIsCurrentPkhValid] = useState<boolean>();
  const [appList, setAppList] = useState<string[]>([]);

  const [streamId, setStreamId] = useState("");
  const [folderId, setFolderId] = useState("");
  const [indexFileId, setIndexFileId] = useState("");
  const [folders, setFolders] = useState<StructuredFolders>();
  const [walletChanged, setWalletChanged] = useState<boolean>(false);

  /*** Wallet ***/
  const connectWallet = async () => {
    try {
      const res = await runtimeConnector.connectWallet(wallet);
      console.log(res);
      setAddress(res.address);
      return address;
    } catch (error) {
      console.error(error);
    }
  };

  const switchNetwork = async () => {
    const res = await runtimeConnector.switchNetwork(137);
    console.log(res);
  };

  const sign = async () => {
    await connectWallet();

    const res = await runtimeConnector.sign({
      method: SignMethod.signMessage,
      params: ["test"],
    });
    console.log(res);
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
    console.log(res);
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
    console.log(res);
  };

  const getCurrentPkh = async () => {
    const res = await runtimeConnector.wallet.getCurrentPkh();
    console.log(res);
    setCurrentPkh(res);
  };

  const connectPKPWallet = async () => {
    const res = await runtimeConnector.connectPKPWallet();
    console.log(res);
    setPKPWallet(res);
  };

  const executeLitAction = async () => {
    if (!pkpWallet.address) {
      throw "Please connect PKP wallet first";
    }
    //   const LIT_ACTION_CALL_CODE = `(async () => {
    //     const latestNonce = await Lit.Actions.getLatestNonce({ address, chain });
    //     Lit.Actions.setResponse({response: JSON.stringify({latestNonce})});
    // })();`;
    //   const executeJsArgs = {
    //     code: LIT_ACTION_CALL_CODE,
    //     jsParams: {
    //       address: pkpWallet.address,
    //       chain: "mumbai",
    //     },
    //   };
    //   const res = await runtimeConnector.executeLitAction(executeJsArgs);
    //   console.log(res);
    //   setLitActionResponse(JSON.stringify(res));

    const LIT_ACTION_SIGN_CODE = `(async () => {
        const sigShare = await Lit.Actions.signEcdsa({ toSign, publicKey , sigName });
        Lit.Actions.setResponse({response: JSON.stringify({sigShare})});
    })();`;
    const executeJsArgs = {
      code: LIT_ACTION_SIGN_CODE,
      jsParams: {
        toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
        publicKey: pkpWallet.publicKey,
        sigName: "sig1",
      },
    };
    const res = await runtimeConnector.executeLitAction(executeJsArgs);
    console.log(res);
    setLitActionResponse(JSON.stringify(res));
  };
  /*** Wallet ***/

  /*** DApp ***/
  const getDAppTable = async () => {
    const appsInfo = await runtimeConnector.getDAppTable();
    console.log(appsInfo);
    setAppList(Object.keys(appsInfo));
  };

  const getDAppInfo = async () => {
    const appsInfo = await runtimeConnector.getDAppInfo(app);
    console.log(appsInfo);
    return appsInfo;
  };

  const getValidAppCaps = async () => {
    const appsInfo = await runtimeConnector.getValidAppCaps();
    console.log(appsInfo);
  };

  const getModelBaseInfo = async () => {
    const res = await runtimeConnector.getModelBaseInfo(modelId);
    console.log(res);
  };
  /*** DApp ***/

  /*** Stream ***/
  const createCapability = async () => {
    // await connectWallet();
    // // await switchNetwork();
    const pkh = await runtimeConnector.createCapability({
      wallet,
      app,
    });
    setPkh(pkh);
    console.log(pkh);
    return pkh;
  };

  const checkCapability = async () => {
    const isCurrentPkhValid = await runtimeConnector.checkCapability();
    console.log(isCurrentPkhValid);
    setIsCurrentPkhValid(isCurrentPkhValid);
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

    setStreamId(res.streamId);
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
      streamId,
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
      syncImmediately: true,
    });
    console.log(res);
  };

  const loadStream = async () => {
    const stream = await runtimeConnector.loadStream(streamId);
    console.log(stream);
  };

  const loadStreamsBy = async () => {
    const streams = await runtimeConnector.loadStreamsBy({
      modelId,
      pkh,
    });
    console.log(streams);
    // const res = Object.values(streams).filter(
    //   (el) => el.controller !== pkh && el.fileType === FileType.Datatoken
    // );
    // console.log(res);
  };

  /*** Stream ***/

  /*** Folders ***/
  const readFolders = async () => {
    const folders = await runtimeConnector.readFolders(app);
    setFolders(folders);
    console.log({ folders });
    return folders;
  };

  const createFolder = async () => {
    const res = await runtimeConnector.createFolder({
      folderType: FolderType.Private,
      folderName: "Private",
    });
    console.log(res);
    setFolderId(res.newFolder.folderId);
    console.log(res.newFolder.folderId);
  };

  const updateFolderBaseInfo = async () => {
    const res = await runtimeConnector.updateFolderBaseInfo({
      folderId,
      newFolderName: new Date().toISOString(),
      newFolderDescription: new Date().toISOString(),
      // syncImmediately: true,
    });
    console.log(res);
  };

  const changeFolderType = async () => {
    const res = await runtimeConnector.changeFolderType({
      folderId,
      targetFolderType: FolderType.Public,
      // syncImmediately: true,
    });
    console.log(res);
  };

  const monetizeFolder = async () => {
    const profileId = await getProfileId({ pkh, lensNickName: "hello123" });

    const res = await runtimeConnector.monetizeFolder({
      folderId,
      folderDescription: "This is a payable folder.",
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

  const deleteFolder = async () => {
    const res = await runtimeConnector.deleteFolder({
      folderId,
      syncImmediately: true,
    });
    console.log(res);
  };

  const deleteAllFolder = async () => {
    if (!folders) {
      throw "Please call readFolders first";
    }
    await Promise.all(
      Object.keys(folders).map((folderId) =>
        runtimeConnector.deleteFolder({
          folderId,
          syncImmediately: true,
        })
      )
    );
  };

  const getDefaultFolderId = async () => {
    if (!folders) {
      throw "Please call readFolders first";
    }
    const { defaultFolderName } = await getDAppInfo();
    const folder = Object.values(folders).find(
      (folder) => folder.options.folderName === defaultFolderName
    );
    return folder!.folderId;
  };
  /*** Folders ***/

  /*** Files ***/
  const uploadFile = async (event: any) => {
    try {
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
        folderId,
        fileBase64,
        fileName,
        encrypted: false,
        storageProvider,
        syncImmediately: true,
      });
      setIndexFileId(res.newFile.indexFileId);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const updateFileBaseInfo = async () => {
    const res = await runtimeConnector.updateFileBaseInfo({
      indexFileId,
      fileInfo: {
        mirrorName: "aaa",
      },
      syncImmediately: true,
    });
    console.log(res);
  };

  const moveFiles = async () => {
    const res = await runtimeConnector.moveFiles({
      targetFolderId: folderId || (await getDefaultFolderId()),
      sourceIndexFileIds: [indexFileId],
      syncImmediately: true,
    });
    console.log(res);
  };

  const monetizeFile = async () => {
    try {
      if (!pkh) {
        throw "You must connect capability";
      }
      const profileId = await getProfileId({ pkh, lensNickName: "hello123" });

      const res = await runtimeConnector.monetizeFile({
        ...(indexFileId ? { indexFileId } : { streamId }),
        datatokenVars: {
          profileId,
          collectLimit: 100,
          amount: 0.0001,
          currency: Currency.WMATIC,
        },
        storageProvider,
        // decryptionConditions: [
        //   {
        //     conditionType: "evmBasic",
        //     contractAddress: "",
        //     standardContractType: "",
        //     chain: "filecoin",
        //     method: "",
        //     parameters: [":userAddress"],
        //     returnValueTest: {
        //       comparator: "=",
        //       value: "0x3c6216caE32FF6691C55cb691766220Fd3f55555",
        //     },
        //   },
        // ], // Only sell to specific users
      });
      console.log(res);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const removeFiles = async () => {
    const res = await runtimeConnector.removeFiles({
      indexFileIds: [indexFileId],
      syncImmediately: true,
    });
    console.log(res);
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
      // const indexFileId =
      //   "kjzl6kcym7w8y8k0cbuzlcrd78o1jpjohqj6tnrakwdq0vklbek5nhj55g2c4se";
      const res = await runtimeConnector.unlock({
        ...(indexFileId ? { indexFileId } : { streamId }),
      });
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

  const getDatatokenBaseInfo = async () => {
    const datatokenId = "0xD0f57610CA33A86d1A9C8749CbEa027fDCff3575";
    const res = await runtimeConnector.getDatatokenBaseInfo(datatokenId);
    console.log(res);
  };
  /*** Monetize ***/

  return (
    <div className="App">
      <button onClick={connectWallet}>connectWallet</button>
      <div className="blackText">{address}</div>
      <hr />
      <button onClick={switchNetwork}>switchNetwork</button>
      <hr />
      <button onClick={sign}>sign</button>
      <hr />
      <button onClick={contractCall}>contractCall</button>
      <hr />
      <button onClick={ethereumRequest}>ethereumRequest</button>
      <hr />
      <button onClick={getCurrentPkh}>getCurrentPkh</button>
      <div className="blackText">{currentPkh}</div>
      <hr />
      <button onClick={connectPKPWallet}>connectPKPWallet</button>
      {pkpWallet.address && (
        <div className="blackText">
          address: {pkpWallet.address} <br />
          publicKey: {pkpWallet.publicKey}
        </div>
      )}
      <hr />
      <button onClick={executeLitAction}>executeLitAction</button>
      <div className="blackText json">{litActionResponse}</div>
      <hr />
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
      <button onClick={createCapability}>createCapability</button>
      <div className="blackText">{pkh}</div>
      <hr />
      <button onClick={checkCapability}>checkCapability</button>
      <div className="blackText">
        {isCurrentPkhValid !== undefined && String(isCurrentPkhValid)}
      </div>
      <hr />
      <button onClick={createStream}>createStream</button>
      <button onClick={updateStream}>updateStream</button>
      <button onClick={loadStream}>loadStream</button>
      <button onClick={loadStreamsBy}>loadStreamsBy</button>
      <br />
      <br />
      <button onClick={readFolders}>readFolders</button>
      <button onClick={createFolder}>createFolder</button>
      <button onClick={updateFolderBaseInfo}>updateFolderBaseInfo</button>
      <button onClick={changeFolderType}>changeFolderType</button>
      <button onClick={monetizeFolder}>monetizeFolder</button>
      <button onClick={deleteFolder}>deleteFolder</button>
      <button onClick={deleteAllFolder}>deleteAllFolder</button>
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
      <button onClick={monetizeFile}>monetizeFile</button>
      <button onClick={removeFiles}>removeFiles</button>
      <br />
      <br />
      <button onClick={createProfile}>createProfile</button>
      <button onClick={getProfiles}>getProfiles</button>
      <button onClick={unlock}>unlock</button>
      <button onClick={isCollected}>isCollected</button>
      <button onClick={getDatatokenBaseInfo}>getDatatokenBaseInfo</button>
      <br />
      <br />
    </div>
  );
}

export default App;
