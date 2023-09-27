import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataverseConnector,
  FolderType,
  StructuredFolderRecord,
  Currency,
  StorageProviderName,
  WALLET,
  RESOURCE,
  SYSTEM_CALL,
  ActionType,
  // StorageResource,
} from "@dataverse/dataverse-connector";
import { Contract, ethers } from "ethers";
import { getAddress } from "viem";
import { WalletProvider } from "@dataverse/wallet-provider";
import "./App.scss";

const dataverseConnector = new DataverseConnector();

export const appId = "a3f0ac63-ff7d-4085-aade-c04888b71088";

const modelId =
  "kjzl6hvfrbw6catek36h3pep09k9gymfnla9k6ojlgrmwjogvjqg8q3zpybl1yu";

const postVersion = "0.0.1";

const storageProvider = {
  name: StorageProviderName.Lighthouse,
  apiKey: "9d632fe6.e756cc9797c345dc85595a688017b226", // input your api key to call createBareFile successfully
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

  const [folders, setFolders] = useState<StructuredFolderRecord>();
  const [folderId, setFolderId] = useState("");

  const [dataUnions, setDataUnions] = useState<StructuredFolderRecord>();
  const [dataUnionId, setDataUnionId] = useState("");

  const [indexFileId, setIndexFileId] = useState("");
  const [actionFileId, setActionFileId] = useState("");
  const [
    dataverseProviderHasAddedListener,
    setDataverseProviderHasAddedListener,
  ] = useState<boolean>();

  const [provider, setProvider] = useState<WalletProvider>();

  const navigate = useNavigate();

  /*** Wallet ***/
  const connectWalletWithDataverseProvider = async (_wallet = wallet) => {
    const provider = new WalletProvider();
    console.log(provider);
    const res = await dataverseConnector.connectWallet({
      ...(_wallet !== WALLET.EXTERNAL_WALLET && { wallet: _wallet }),
      provider,
    });
    console.log(res);
    setProvider(provider);
    setWallet(res.wallet);
    setAddress(res.address);
    if (!dataverseProviderHasAddedListener) {
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
      setDataverseProviderHasAddedListener(true);
    }
    return res;
  };

  const connectWalletWithMetamaskProvider = async (_wallet = wallet) => {
    const provider = (window as any).ethereum;
    console.log(provider);
    const res = await dataverseConnector.connectWallet({
      wallet: _wallet,
      provider,
    });
    console.log(res);
    setProvider(provider);
    setWallet(WALLET.EXTERNAL_WALLET);
    setAddress(res.address);
    provider.on("chainChanged", (networkId: string) => {
      console.log(Number(networkId));
    });
    provider.on("accountsChanged", (accounts: Array<string>) => {
      console.log(accounts);
      setAddress(getAddress(accounts[0]));
    });
    return res;
  };

  const getCurrentWallet = async () => {
    const res = await dataverseConnector.getCurrentWallet();
    if (res) {
      if (res.wallet !== WALLET.EXTERNAL_WALLET) {
        await connectWalletWithDataverseProvider(res.wallet);
      } else {
        await connectWalletWithMetamaskProvider(res.wallet);
      }
    } else {
      console.log(res);
    }
    return res;
  };

  const switchNetwork = async () => {
    if (!dataverseConnector?.isConnected) {
      console.error("please connect wallet first");
      return;
    }

    await provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });
  };

  const signOrSignTypedData = async () => {
    if (!dataverseConnector?.isConnected) {
      console.error("please connect wallet first");
      return;
    }

    const res = await provider?.request({
      method: "personal_sign",
      params: [address, "test"],
    });

    console.log(res);

    await provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });

    const res2 = await provider?.request({
      method: "eth_signTypedData_v4",
      params: [
        address,
        JSON.stringify({
          domain: {
            name: "EPNS COMM V1",
            chainId: 80001,
            verifyingContract: "0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa",
          },
          primaryType: "Data",
          types: {
            Data: [
              {
                name: "data",
                type: "string",
              },
            ],
            EIP712Domain: [
              {
                name: "name",
                type: "string",
              },
              {
                name: "chainId",
                type: "uint256",
              },
              {
                name: "verifyingContract",
                type: "address",
              },
            ],
          },
          message: {
            data: '2+{"notification":{"title":"Push Title Hello","body":"Good to see you bodies"},"data":{"acta":"","aimg":"","amsg":"Payload Push Title Hello Body","asub":"Payload Push Title Hello","type":"1"},"recipients":"eip155:5:0x6ed14ee482d3C4764C533f56B90360b767d21D5E"}',
          },
        }),
      ],
    });

    console.log(res2);
  };

  const sendTransaction = async () => {
    if (!dataverseConnector?.isConnected) {
      console.error("please connect wallet first");
      return;
    }
    const res = await provider?.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: dataverseConnector.address, // The user's active address.
          to: dataverseConnector.address, // Required except during contract publications.
          value: "0xE8D4A50FFD41E", // Only required to send ether to the recipient from the initiating external account.
          // gasPrice: "0x09184e72a000", // Customizable by the user during MetaMask confirmation.
          // gas: "0x2710", // Customizable by the user during MetaMask confirmation.
        },
      ],
    });

    console.log(res);

    // const ethersProvider = new ethers.providers.Web3Provider(provider!);

    // const ethersSigner = ethersProvider.getSigner();
    // const res = await ethersSigner.sendTransaction({
    //   from: dataverseConnector.address, // The user's active address.
    //   to: dataverseConnector.address, // Required except during contract publications.
    //   value: "0xE8D4A50FFD41E", // Only required to send ether to the recipient from the initiating external account.
    //   // gasPrice: "0x09184e72a000", // Customizable by the user during MetaMask confirmation.
    //   // gas: "0x2710", // Customizable by the user during MetaMask confirmation.
    // });
    // const tx = await res.wait();
    // console.log(tx);
  };

  const contractCall = async () => {
    if (!dataverseConnector?.isConnected) {
      console.error("please connect wallet first");
      return;
    }

    await provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });

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
    const res = dataverseConnector.getCurrentPkh();
    console.log(res);
    setCurrentPkh(res);
  };

  const getPKP = async () => {
    const res = await dataverseConnector.runOS({ method: SYSTEM_CALL.getPKP });
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
    //   const res = await dataverseConnector.executeLitAction(executeJsArgs);
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
    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.executeLitAction,
      params: executeJsArgs,
    });
    console.log(res);
    setLitActionResponse(JSON.stringify(res));
  };
  /*** Wallet ***/

  /*** DApp ***/
  const getDAppTable = async () => {
    const appsInfo = await dataverseConnector.getDAppTable();
    console.log(appsInfo);
    setAppListInfo(`${appsInfo.length} results show in console.`);
  };

  const getDAppInfo = async () => {
    const appInfo = await dataverseConnector.getDAppInfo(appId);
    console.log(appInfo);
    setAppInfo(`1 result show in console.`);
    return appInfo;
  };

  const getValidAppCaps = async () => {
    const appsInfo = await dataverseConnector.runOS({
      method: SYSTEM_CALL.getValidAppCaps,
    });
    console.log(appsInfo);
  };

  const getModelBaseInfo = async () => {
    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.getModelBaseInfo,
      params: modelId,
    });
    console.log(res);
  };
  /*** DApp ***/

  /*** Capability ***/
  const createCapability = async () => {
    await connectWalletWithMetamaskProvider();
    const pkh = await dataverseConnector.runOS({
      method: SYSTEM_CALL.createCapability,
      params: {
        appId,
        resource: RESOURCE.CERAMIC,
      },
    });
    setPkh(pkh);
    console.log(pkh);
    return pkh;
  };

  const checkCapability = async () => {
    const isCurrentPkhValid = await dataverseConnector.runOS({
      method: SYSTEM_CALL.checkCapability,
      params: {
        appId,
      },
    });
    console.log(isCurrentPkhValid);
    setIsCurrentPkhValid(isCurrentPkhValid);
  };

  /*** Capability ***/

  /*** Folders ***/
  const readFolders = async () => {
    const folders = await dataverseConnector.runOS({
      method: SYSTEM_CALL.readFolders,
    });
    setFolders(folders);
    console.log({ folders });
    return folders;
  };

  const createFolder = async () => {
    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.createFolder,
      params: {
        folderType: FolderType.PrivateFolderType,
        folderName: "Private",
      },
    });
    console.log(res);
    setFolderId(res.newFolder.folderId);
    console.log(res.newFolder.folderId);
  };

  const updateFolderBaseInfo = async () => {
    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.updateFolderBaseInfo,
      params: {
        folderId,
        newFolderName: new Date().toISOString(),
        newFolderDescription: new Date().toISOString(),
      },
    });
    console.log(res);
  };

  const readFolderById = async () => {
    const folder = await dataverseConnector.runOS({
      method: SYSTEM_CALL.readFolderById,
      params: folderId,
    });
    console.log({ folder });
    return folder;
  };

  const deleteFolder = async () => {
    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.deleteFolder,
      params: {
        folderId,
      },
    });
    console.log(res);
  };

  const deleteAllFolder = async () => {
    if (!folders) {
      throw "Please call readFolders first";
    }
    await Promise.all(
      Object.keys(folders).map(folderId =>
        dataverseConnector.runOS({
          method: SYSTEM_CALL.deleteFolder,
          params: { folderId },
        }),
      ),
    );
  };

  const getDefaultFolderId = async () => {
    if (!folders) {
      throw "Please call readFolders first";
    }
    const { defaultFolderName } = await getDAppInfo();
    const folder = Object.values(folders).find(
      folder => folder.folderName === defaultFolderName,
    );
    return folder!.folderId;
  };
  /*** Folders ***/

  /*** DataUnions ***/
  const readDataUnions = async () => {
    const dataUnions = await dataverseConnector.runOS({
      method: SYSTEM_CALL.readDataUnions,
    });
    setDataUnions(dataUnions);
    console.log({ dataUnions });
    return folders;
  };

  const createDataUnion = async () => {
    const profileId = await getProfileId({
      pkh,
      lensNickName: "hello123456",
    });

    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.createDataUnion,
      params: {
        dataUnionName: "data union",
        // contentType: { resource: StorageResource.CERAMIC, resourceId: modelId },
        // contentType: { resource: StorageResource.IPFS },
        // actionType: ActionType.LIKE,
        dataUnionVars: {
          profileId,
          collectLimit: 100,
          amount: 0.0001,
          currency: Currency.WMATIC,
        },
      },
    });
    console.log(res);
    setDataUnionId(res.newDataUnion.folderId);
    console.log(res.newDataUnion.folderId);
  };

  const deleteDataUnion = async () => {
    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.deleteDataUnion,
      params: {
        dataUnionId,
      },
    });
    console.log(res);
  };

  const deleteAllDataUnion = async () => {
    if (!dataUnions) {
      throw "Please call readDataUnions first";
    }
    await Promise.all(
      Object.keys(dataUnions).map(dataUnionId =>
        dataverseConnector.runOS({
          method: SYSTEM_CALL.deleteDataUnion,
          params: { dataUnionId },
        }),
      ),
    );
  };
  /*** DataUnions ***/

  /*** Files ***/
  const createFile = async () => {
    const date = new Date().toISOString();

    const encrypted = JSON.stringify({
      text: false,
      images: false,
      videos: false,
    });

    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.createFile,
      params: {
        modelId,
        fileName: "create a file",
        fileContent: {
          modelVersion: postVersion,
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

    setIndexFileId(res.fileContent.file.fileId);
    console.log(res);
  };

  const updateFile = async () => {
    const date = new Date().toISOString();

    const encrypted = JSON.stringify({
      text: true,
      images: true,
      videos: false,
    });

    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.updateFile,
      params: {
        fileId: indexFileId,
        fileName: "update the file",
        fileContent: {
          modelVersion: postVersion,
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

  const loadFile = async () => {
    const file = await dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFile,
      params: indexFileId,
    });
    console.log(file);
  };

  const loadFilesBy = async () => {
    const fileRecord = await dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFilesBy,
      params: {
        modelId,
        pkh,
      },
    });
    console.log(fileRecord);
  };

  const createActionFile = async () => {
    if (!indexFileId) {
      throw "RelationId cannnot be empty";
    }
    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.createActionFile,
      params: {
        folderId,
        action: {
          actionType: ActionType.LIKE,
          comment: "I like it!",
          isRelationIdEncrypted: false,
          isCommentEncrypted: false,
        },
        relationId: indexFileId,
        fileName: "like",
      },
    });
    setActionFileId(res.newFile.fileId);
    console.log(res);
  };

  const updateActionFile = async () => {
    if (!indexFileId) {
      throw "RelationId cannnot be empty";
    }
    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.updateActionFile,
      params: {
        fileId: actionFileId,
        isRelationIdEncrypted: true,
        isCommentEncrypted: true,
        fileName: "like",
      },
    });
    setActionFileId(res.currentFile.fileId);
    console.log(res);
  };

  const createBareFile = async (event: any) => {
    try {
      const file = event.target.files[0];
      console.log(file);
      if (!file) {
        return;
      }
      const fileName = file.name;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      const fileBase64: string = await new Promise(resolve => {
        reader.addEventListener("load", async (e: any) => {
          resolve(e.target.result);
        });
      });

      console.log(fileBase64);

      const isDatatoken = true;
      let datatokenVars;

      if (isDatatoken) {
        const profileId = await getProfileId({
          pkh,
          lensNickName: "hello123456",
        });
        datatokenVars = {
          profileId,
          collectLimit: 100,
          amount: 0.0001,
          currency: Currency.WMATIC,
        };
      }

      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.createBareFile,
        params: {
          folderId,
          fileBase64,
          fileName,
          encrypted: true,
          storageProvider,
          dataUnionId,
          datatokenVars,
          // unlockingTimeStamp: String(
          //   Math.floor(Date.now() / 1000) + 5 * 60,
          //   // Math.floor(Date.now() / 1000) + 1 * 60 * 60 * 24,
          // ),
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
          // ], // Only sell to specific users;
        },
      });
      setIndexFileId(res.newFile.fileId);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const updateBareFile = async (event: any) => {
    try {
      const file = event.target.files[0];
      console.log(file);
      if (!file) {
        return;
      }
      const fileName = file.name;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      const fileBase64: string = await new Promise(resolve => {
        reader.addEventListener("load", async (e: any) => {
          resolve(e.target.result);
        });
      });

      console.log(fileBase64);

      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.updateBareFile,
        params: {
          fileId: indexFileId,
          fileBase64,
          fileName,
          encrypted: true,
          storageProvider,
        },
      });
      setIndexFileId(res.currentFile.fileId);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const readBareFileContent = async () => {
    try {
      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.readBareFileContent,
        params: indexFileId,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const moveFiles = async () => {
    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.moveFiles,
      params: {
        targetFolderId: folderId || (await getDefaultFolderId()),
        fileIds: [actionFileId || indexFileId],
      },
    });
    console.log(res);
  };

  const monetizeFile = async () => {
    try {
      if (!pkh) {
        throw "You must connect capability";
      }

      await provider?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });

      const isDatatoken = true;
      let datatokenVars;

      if (isDatatoken) {
        const profileId = await getProfileId({
          pkh,
          lensNickName: "hello123456",
        });
        datatokenVars = {
          profileId,
          collectLimit: 100,
          amount: 0.0001,
          currency: Currency.WMATIC,
        };
      }

      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.monetizeFile,
        params: {
          // actionFile cannot be monetized to a datatoken
          fileId: (!isDatatoken && actionFileId) || indexFileId,
          datatokenVars,
          dataUnionId,
          // unlockingTimeStamp: String(
          //   Math.floor(Date.now() / 1000) + 5 * 60,
          //   // Math.floor(Date.now() / 1000) + 1 * 60 * 60 * 24,
          // ),
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
          // ], // Only sell to specific users;
        },
      });

      console.log(res);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const removeFiles = async () => {
    const res = await dataverseConnector.runOS({
      method: SYSTEM_CALL.removeFiles,
      params: {
        fileIds: [actionFileId || indexFileId],
      },
    });
    console.log(res);
  };
  /*** Files ***/

  /*** Monetize ***/
  const createProfile = async () => {
    await provider?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });
    const res = await dataverseConnector.createProfile("test01");
    console.log(res);
  };

  const getProfiles = async () => {
    const res = await dataverseConnector.getProfiles(address);
    console.log(res);
  };

  const getProfileId = async ({
    pkh,
    lensNickName,
  }: {
    pkh: string;
    lensNickName?: string;
  }) => {
    const lensProfiles = await dataverseConnector.getProfiles(
      pkh.slice(pkh.lastIndexOf(":") + 1),
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
      profileId = await dataverseConnector.createProfile(lensNickName);
    }

    return profileId;
  };

  const collectFile = async () => {
    try {
      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.collectFile,
        params: actionFileId || indexFileId,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const collectDataUnion = async () => {
    try {
      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.collectDataUnion,
        params: dataUnionId,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const unlockFile = async () => {
    try {
      const res = await dataverseConnector.runOS({
        method: SYSTEM_CALL.unlockFile,
        params: actionFileId || indexFileId,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const isCollected = async () => {
    const datatokenId = "0xcF37808924b474f11108a3dbcEF1cA9966bfc1cF";
    const address = "0x312eA852726E3A9f633A0377c0ea882086d66666";
    const res = await dataverseConnector.isCollected({
      datatokenId,
      address,
    });
    console.log(res);
  };

  const getDatatokenBaseInfo = async () => {
    const datatokenId = "0xD0f57610CA33A86d1A9C8749CbEa027fDCff3575";
    const res = await dataverseConnector.getDatatokenBaseInfo(datatokenId);
    console.log(res);
  };
  /*** Monetize ***/

  return (
    <div className='App'>
      <button onClick={() => navigate("/wagmi")}>go to wagmi demo page</button>
      <button onClick={() => connectWalletWithDataverseProvider()}>
        connectWalletWithDataverseProvider
      </button>
      <button onClick={() => connectWalletWithMetamaskProvider()}>
        connectWalletWithMetamaskProvider
      </button>
      <div className='blackText'>{address}</div>
      <hr />
      <button onClick={getCurrentWallet}>getCurrentWallet</button>
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
      <div className='blackText'>{currentPkh}</div>
      <hr />
      <button onClick={getPKP}>getPKP</button>
      {pkpWallet.address && (
        <div className='blackText'>
          address: {pkpWallet.address} <br />
          publicKey: {pkpWallet.publicKey}
        </div>
      )}
      <hr />
      <button onClick={executeLitAction}>executeLitAction</button>
      <div className='blackText json'>{litActionResponse}</div>
      <hr />
      <br />
      <br />
      <button onClick={getDAppTable}>getDAppTable</button>
      {appListInfo}
      <hr />
      <button onClick={getDAppInfo}>getDAppInfo</button>
      {appInfo}
      <hr />
      <button onClick={getValidAppCaps}>getValidAppCaps</button>
      <button onClick={getModelBaseInfo}>getModelBaseInfo</button>
      <br />
      <br />
      <button onClick={createCapability}>createCapability</button>
      <div className='blackText'>{pkh}</div>
      <hr />
      <button onClick={checkCapability}>checkCapability</button>
      <div className='blackText'>
        {isCurrentPkhValid !== undefined && String(isCurrentPkhValid)}
      </div>
      <hr />
      <br />
      <button onClick={readFolders}>readFolders</button>
      <button onClick={createFolder}>createFolder</button>
      <button onClick={updateFolderBaseInfo}>updateFolderBaseInfo</button>
      <button onClick={readFolderById}>readFolderById</button>
      <button onClick={deleteFolder}>deleteFolder</button>
      <button onClick={deleteAllFolder}>deleteAllFolder</button>
      <br />
      <br />
      <button onClick={readDataUnions}>readDataUnions</button>
      <button onClick={createDataUnion}>createDataUnion</button>
      <button onClick={deleteDataUnion}>deleteDataUnion</button>
      <button onClick={deleteAllDataUnion}>deleteAllDataUnion</button>
      <br />
      <br />
      <button onClick={createFile}>createFile</button>
      <button onClick={updateFile}>updateFile</button>
      <button onClick={loadFile}>loadFile</button>
      <button onClick={loadFilesBy}>loadFilesBy</button>
      <button onClick={createActionFile}>createActionFile</button>
      <button onClick={updateActionFile}>updateActionFile</button>
      <button>
        <span>createBareFile</span>
        <input
          type='file'
          onChange={createBareFile}
          name='createBareFile'
          style={{ width: "168px", marginLeft: "10px" }}
        />
      </button>
      <button>
        <span>updateBareFile</span>
        <input
          type='file'
          onChange={updateBareFile}
          name='updateBareFile'
          style={{ width: "168px", marginLeft: "10px" }}
        />
      </button>
      <button onClick={readBareFileContent}>readBareFileContent</button>
      <button onClick={moveFiles}>moveFiles</button>
      <button onClick={monetizeFile}>monetizeFile</button>
      <button onClick={removeFiles}>removeFiles</button>
      <br />
      <br />
      <button onClick={createProfile}>createProfile</button>
      <button onClick={getProfiles}>getProfiles</button>
      <button onClick={collectFile}>collectFile</button>
      <button onClick={collectDataUnion}>collectDataUnion</button>
      <button onClick={unlockFile}>unlockFile</button>
      <button onClick={isCollected}>isCollected</button>
      <button onClick={getDatatokenBaseInfo}>getDatatokenBaseInfo</button>
      <br />
      <br />
    </div>
  );
}

export default App;
