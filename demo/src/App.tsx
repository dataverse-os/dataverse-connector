import "./App.css";
import React, { useEffect, useState } from "react";
import {
  CoreConnector,
  FolderType,
  StructuredFolders,
  Currency,
  StorageProviderName,
  WALLET,
  RESOURCE,
  Chain,
  SignMethod,
  Methods,
} from "@dataverse/core-connector";

import { WalletProvider } from "@dataverse/wallet-provider";

import { getAddressFromPkh } from "./utils/addressAndPkh";
import { Contract, ethers } from "ethers";

const coreConnector = new CoreConnector();

const app = "toolkits_test011"; //toolkits_test011 (testnet)
const dappId = "74d47474-89b0-45eb-940b-73d7f31ca41c";
const postVersion = "0.0.1";

const modelId =
  "kjzl6hvfrbw6c6ow3w4p4nmebboionqx4mhgk0t6aqjwtmlvi8s19tnth5edoj1"; // (testnet)

const storageProvider = {
  name: StorageProviderName.Lighthouse,
  apiKey: "9d632fe6.e756cc9797c345dc85595a688017b226", // input your api key to call uploadFile successfully
};

function App() {
  const [address, setAddress] = useState("");
  const [wallet, setWallet] = useState<WALLET>();
  const [pkh, setPkh] = useState("");
  const [currentPkh, setCurrentPkh] = useState("");
  const [pkpWallet, setPKPWallet] = useState({
    address: "",
    publicKey: "",
  });
  const [litActionResponse, setLitActionResponse] = useState("");

  const [isCurrentPkhValid, setIsCurrentPkhValid] = useState<boolean>();
  const [appListInfo, setAppListInfo] = useState<string>("");
  const [appInfo, setAppInfo] = useState<string>("");

  const [streamId, setStreamId] = useState("");
  const [folderId, setFolderId] = useState("");
  const [indexFileId, setIndexFileId] = useState("");
  const [folders, setFolders] = useState<StructuredFolders>();
  const [hasAddListener, setHasAddListener] = useState<boolean>();
  const [provider, setProvider] = useState<WalletProvider>();

  /*** Wallet ***/
  const connectWallet = async () => {
    const res = await coreConnector.connectWallet(wallet);
    console.log(res);
    const provider = coreConnector.getProvider();
    console.log(provider);
    setProvider(provider);
    setWallet(res.wallet);
    setAddress(res.address);
    if (!hasAddListener) {
      provider.on("chainChanged", (chainId: number) => {
        console.log(chainId);
      });
      provider.on("chainNameChanged", (chainName: string) => {
        console.log(chainName);
      });
      provider.on("accountsChanged", (accounts: Array<string>) => {
        console.log(accounts);
        setAddress(accounts[0]);
      });
      setHasAddListener(true);
    }
    return res;
  };

  const switchNetwork = async () => {
    if (!coreConnector?.isConnected) {
      console.error("please connect wallet first");
      return;
    }

    await provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });

    // const res = await coreConnector.switchNetwork(137);
  };

  const signOrSignTypedData = async () => {
    if (!coreConnector?.isConnected) {
      console.error("please connect wallet first");
      return;
    }
    const res = await provider?.signMessage("test");

    console.log(res);

    await provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });
    const res2 = await provider?._signTypedData(
      {
        name: "EPNS COMM V1",
        chainId: 80001,
        verifyingContract: "0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa",
      },
      {
        Data: [
          {
            name: "data",
            type: "string",
          },
        ],
      },
      {
        data: '2+{"notification":{"title":"Push Title Hello","body":"Good to see you bodies"},"data":{"acta":"","aimg":"","amsg":"Payload Push Title Hello Body","asub":"Payload Push Title Hello","type":"1"},"recipients":"eip155:5:0x6ed14ee482d3C4764C533f56B90360b767d21D5E"}',
      }
    );

    console.log(res2);
  };

  const sendTransaction = async () => {
    if (!coreConnector?.isConnected) {
      console.error("please connect wallet first");
      return;
    }

    const res = await provider?.sendTransaction({
      from: coreConnector.address, // The user's active address.
      to: coreConnector.address, // Required except during contract publications.
      value: "0xE8D4A50FFD41E", // Only required to send ether to the recipient from the initiating external account.
      // gasPrice: "0x09184e72a000", // Customizable by the user during MetaMask confirmation.
      // gas: "0x2710", // Customizable by the user during MetaMask confirmation.
    });

    console.log(res);
  };

  const contractCall = async () => {
    if (!coreConnector?.isConnected) {
      console.error("please connect wallet first");
      return;
    }

    await coreConnector.runOS({ method: Methods.switchNetwork, params: 80001 });

    const contractAddress = "0x2e43c080B56c644F548610f45998399d42e3d400";

    const abi = [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "value_",
            type: "uint256",
          },
        ],
        name: "setValue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "value",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const ethersProvider = new ethers.providers.Web3Provider(provider!);

    const ethersSigner = ethersProvider.getSigner();

    const contract = new Contract(contractAddress, abi, ethersSigner);

    const res = await contract.setValue(12345);
    console.log(res);

    const tx = await res.wait();
    console.log(tx);

    const value = await contract.value();
    console.log(value);

    return tx;
  };

  const getCurrentPkh = async () => {
    const res = await coreConnector.runOS({ method: Methods.getCurrentPkh });
    console.log(res);
    setCurrentPkh(res);
  };

  const getPKP = async () => {
    const res = await coreConnector.runOS({ method: Methods.getPKP });
    console.log(res);
    setPKPWallet(res);
  };

  const executeLitAction = async () => {
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
    //   const res = await coreConnector.executeLitAction(executeJsArgs);
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
    const res = await coreConnector.runOS({
      method: Methods.executeLitAction,
      params: executeJsArgs,
    });
    console.log(res);
    setLitActionResponse(JSON.stringify(res));
  };
  /*** Wallet ***/

  /*** DApp ***/
  const getDAppTable = async () => {
    const appsInfo = await coreConnector.getDAppTable();
    console.log(appsInfo);
    setAppListInfo(`${appsInfo.length} results show in console.`);
  };

  const getDAppInfo = async () => {
    const appInfo = await coreConnector.getDAppInfo(dappId);
    console.log(appInfo);
    setAppInfo(JSON.stringify(appInfo));
    return appInfo;
  };

  const getValidAppCaps = async () => {
    const appsInfo = await coreConnector.runOS({
      method: Methods.getValidAppCaps,
    });
    console.log(appsInfo);
  };

  const getModelBaseInfo = async () => {
    const res = await coreConnector.runOS({
      method: Methods.getModelBaseInfo,
      params: modelId,
    });
    console.log(res);
  };
  /*** DApp ***/

  /*** Stream ***/
  const createCapability = async () => {
    const pkh = await coreConnector.runOS({
      method: Methods.createCapability,
      params: {
        app,
        resource: RESOURCE.CERAMIC,
        wallet,
      },
    });
    setPkh(pkh);
    console.log(pkh);
    return pkh;
  };

  const checkCapability = async () => {
    const isCurrentPkhValid = await coreConnector.runOS({
      method: Methods.checkCapability,
      params: {
        app,
      },
    });
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

    const res = await coreConnector.runOS({
      method: Methods.createStream,
      params: {
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

    const res = await coreConnector.runOS({
      method: Methods.updateStream,
      params: {
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
      },
    });
    console.log(res);
  };

  const loadStream = async () => {
    const stream = await coreConnector.runOS({
      method: Methods.loadStream,
      params: streamId,
    });
    console.log(stream);
  };

  const loadStreamsBy = async () => {
    const streams = await coreConnector.runOS({
      method: Methods.loadStreamsBy,
      params: {
        modelId,
        pkh,
      },
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
    const folders = await coreConnector.runOS({
      method: Methods.readFolders,
    });
    setFolders(folders);
    console.log({ folders });
    return folders;
  };

  const createFolder = async () => {
    const res = await coreConnector.runOS({
      method: Methods.createFolder,
      params: {
        folderType: FolderType.Private,
        folderName: "Private",
      },
    });
    console.log(res);
    setFolderId(res.newFolder.folderId);
    console.log(res.newFolder.folderId);
  };

  const updateFolderBaseInfo = async () => {
    const res = await coreConnector.runOS({
      method: Methods.updateFolderBaseInfo,
      params: {
        folderId,
        newFolderName: new Date().toISOString(),
        newFolderDescription: new Date().toISOString(),
      },
    });
    console.log(res);
  };

  const changeFolderType = async () => {
    const res = await coreConnector.runOS({
      method: Methods.changeFolderType,
      params: {
        folderId,
        targetFolderType: FolderType.Public,
      },
    });
    console.log(res);
  };

  const monetizeFolder = async () => {
    const profileId = await getProfileId({ pkh, lensNickName: "hello123" });

    const res = await coreConnector.runOS({
      method: Methods.monetizeFolder,
      params: {
        folderId,
        folderDescription: "This is a payable folder.",
        datatokenVars: {
          profileId,
          collectLimit: 100,
          amount: 0.0001,
          currency: Currency.WMATIC,
        },
      },
    });
    console.log(res);
    return res;
  };

  const readFolderById = async () => {
    const folder = await coreConnector.runOS({
      method: Methods.readFolderById,
      params: folderId,
    });
    console.log({ folder });
    return folder;
  };

  const deleteFolder = async () => {
    const res = await coreConnector.runOS({
      method: Methods.deleteFolder,
      params: { folderId },
    });
    console.log(res);
  };

  const deleteAllFolder = async () => {
    if (!folders) {
      throw "Please call readFolders first";
    }
    await Promise.all(
      Object.keys(folders).map((folderId) =>
        coreConnector.runOS({
          method: Methods.deleteFolder,
          params: { folderId },
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
      // var binaryString = atob(fileBase64.split(",")[1]);
      // console.log(binaryString);
      // var bytes = new Uint8Array(binaryString.length);
      // for (var i = 0; i < binaryString.length; i++) {
      //   bytes[i] = binaryString.charCodeAt(i);
      // }
      // console.log(bytes);
      // console.log(bytes.buffer);
      const res = await coreConnector.runOS({
        method: Methods.uploadFile,
        params: {
          folderId,
          fileBase64,
          fileName,
          encrypted: false,
          storageProvider,
        },
      });
      setIndexFileId(res.newFile.indexFileId);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const updateFileBaseInfo = async () => {
    const res = await coreConnector.runOS({
      method: Methods.updateFileBaseInfo,
      params: {
        indexFileId,
        fileInfo: {
          mirrorName: "aaa",
        },
      },
    });
    console.log(res);
  };

  const moveFiles = async () => {
    const res = await coreConnector.runOS({
      method: Methods.moveFiles,
      params: {
        targetFolderId: folderId || (await getDefaultFolderId()),
        sourceIndexFileIds: [indexFileId],
      },
    });
    console.log(res);
  };

  const monetizeFile = async () => {
    try {
      if (!pkh) {
        throw "You must connect capability";
      }
      const profileId = await getProfileId({
        pkh,
        lensNickName: "hello123456",
      });

      const res = await coreConnector.runOS({
        method: Methods.monetizeFile,
        params: {
          ...(indexFileId ? { indexFileId } : { streamId }),
          datatokenVars: {
            profileId,
            collectLimit: 100,
            amount: 0.0001,
            currency: Currency.WMATIC,
          },
          // decryptionConditions: [
          //   [
          //     {
          //       conditionType: "evmBasic",
          //       contractAddress: "",
          //       standardContractType: "",
          //       chain: "filecoin",
          //       method: "",
          //       parameters: [":userAddress"],
          //       returnValueTest: {
          //         comparator: "=",
          //         value: "0xd10d5b408A290a5FD0C2B15074995e899E944444",
          //       },
          //     },
          //     { operator: "or" },
          //     {
          //       conditionType: "evmBasic",
          //       contractAddress: "",
          //       standardContractType: "",
          //       chain: "filecoin",
          //       method: "",
          //       parameters: [":userAddress"],
          //       returnValueTest: {
          //         comparator: "=",
          //         value: "0x3c6216caE32FF6691C55cb691766220Fd3f55555",
          //       },
          //     },
          //   ] as any,
          // ], // Only sell to specific users
        },
      });

      console.log(res);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const removeFiles = async () => {
    const res = await coreConnector.runOS({
      method: Methods.removeFiles,
      params: {
        indexFileIds: [indexFileId],
      },
    });
    console.log(res);
  };
  /*** Files ***/

  /*** Monetize ***/
  const createProfile = async () => {
    await coreConnector.runOS({
      method: Methods.switchNetwork,
      params: 80001,
    });
    const res = await coreConnector.runOS({
      method: Methods.createProfile,
      params: "test6",
    });
    console.log(res);
  };

  const getProfiles = async () => {
    const res = await coreConnector.runOS({
      method: Methods.getProfiles,
      params: address,
    });
    console.log(res);
  };

  const getProfileId = async ({
    pkh,
    lensNickName,
  }: {
    pkh: string;
    lensNickName?: string;
  }) => {
    const lensProfiles = await coreConnector.runOS({
      method: Methods.getProfiles,
      params: getAddressFromPkh(pkh),
    });

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
      profileId = await coreConnector.runOS({
        method: Methods.createProfile,
        params: lensNickName,
      });
    }

    return profileId;
  };

  const unlock = async () => {
    try {
      // const indexFileId =
      //   "kjzl6kcym7w8y8k0cbuzlcrd78o1jpjohqj6tnrakwdq0vklbek5nhj55g2c4se";
      const res = await coreConnector.runOS({
        method: Methods.unlock,
        params: {
          ...(indexFileId ? { indexFileId } : { streamId }),
        },
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const isCollected = async () => {
    const datatokenId = "0xD0f57610CA33A86d1A9C8749CbEa027fDCff3575";
    const address = "0xdC4b09aBf7dB2Adf6C5b4d4f34fd54759aAA5Ccd";
    const res = await coreConnector.runOS({
      method: Methods.isCollected,
      params: {
        datatokenId,
        address,
      },
    });
    console.log(res);
  };

  const getDatatokenBaseInfo = async () => {
    const datatokenId = "0xD0f57610CA33A86d1A9C8749CbEa027fDCff3575";
    const res = await coreConnector.runOS({
      method: Methods.getDatatokenBaseInfo,
      params: datatokenId,
    });
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
      <button onClick={signOrSignTypedData}>signOrSignTypedData</button>
      <hr />
      <button onClick={sendTransaction}>sendTransaction</button>
      <hr />
      <button onClick={contractCall}>contractCall</button>
      <hr />
      <button onClick={getCurrentPkh}>getCurrentPkh</button>
      <div className="blackText">{currentPkh}</div>
      <hr />
      <button onClick={getPKP}>getPKP</button>
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
      {appListInfo}
      <hr />
      <button onClick={getDAppInfo}>getDAppInfo</button>
      {appInfo}
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
      <button onClick={readFolderById}>readFolderById</button>
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
