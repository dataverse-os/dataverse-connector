import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import {
  RuntimeConnector,
  Extension,
  METAMASK,
  PARTICLE,
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
  DecryptionConditions,
  Mode,
} from "@dataverse/runtime-connector";
import { decode } from "./utils/encodeAndDecode";
import { getAddressFromDid } from "./utils/addressAndDID";

const runtimeConnector = new RuntimeConnector(Extension);
const appName = Apps.Playground;
const slug = Apps.Playground;
export const modelName = `${slug.toLowerCase()}_post`;
export const modelNames = [modelName];
const postVersion = "0.0.1";

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
  const ENV = "ENV";

  /*** Identity ***/
  const connectWallet = async () => {
    try {
      const address = await runtimeConnector.connectWallet({
        name: PARTICLE,
        type: CRYPTO_WALLET_TYPE,
      });
      setAddress(address);
      console.log({ address });
      return address;
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentWallet = async () => {
    try {
      const res = await runtimeConnector.getCurrentWallet();
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const switchNetwork = async () => {
    const res = await runtimeConnector.switchNetwork(80001);
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

  const signerSign = async () => {
    await connectWallet();

    const res = await runtimeConnector.signerSign({
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

  const generateUnifiedAccessControlConditions = async () => {
    const datatokenId = "0xFd2aC484525AaA02D112eC4c87EbA6B17c7DCDC1";
    const modelId = await runtimeConnector.getModelIdByAppNameAndModelName({
      appName,
      modelName,
    });
    const chain = await runtimeConnector.getChainFromDID(did);
    const datatokenChain = await getChainOfDatatoken();
    const conditions: any = [
      {
        conditionType: "evmBasic",
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
    conditions.push({ operator: "and" });
    const unifiedAccessControlConditions = [
      {
        contractAddress: datatokenId,
        conditionType: "evmContract",
        functionName: "isCollected",
        functionParams: [":userAddress"],
        functionAbi: {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          name: "isCollected",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        chain: datatokenChain,
        returnValueTest: {
          key: "",
          comparator: "=",
          value: "true",
        },
      },
      { operator: "or" },
      {
        conditionType: "evmBasic",
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
    ];
    conditions.push(unifiedAccessControlConditions);
    return conditions;
  };

  const newLitKey = async () => {
    const did = await connectIdentity();
    const decryptionConditions = await generateAccessControlConditions();
    // const decryptionConditions = await generateUnifiedAccessControlConditions();

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
    const did = await connectIdentity();
    const decryptionConditions = await generateAccessControlConditions();
    // const decryptionConditions = await generateUnifiedAccessControlConditions();
    const decryptionConditionsType =
      DecryptionConditionsTypes.AccessControlCondition;

    const { encryptedContent } = await runtimeConnector.encryptWithLit({
      did,
      appName,
      modelNames,
      content: "hello world",
      encryptedSymmetricKey:
        "a3a328fff5dc75a4fdbb5379e06597d7b28e0da48b4ccae40fd29ab797a1822dee0a2e9a85faa2c9b24e4ffc7d45ce0f60e54fe0ab31f3d6ba03c051aebb4ae080bb025faadc299d49325172ac2f8f7bef39fabe00be00d782386cba0c7bf18f5268aff09cece700f41af20eb293c94ec1654d74baf9fb3c94bd4db52c390ecc000000000000002046b183b333424553c1ca8924d54002b5def910f1f4a9411bb9d669217d74e7295768ea89d7bbd44b046f351a0cc95f8c",
      decryptionConditions,
      decryptionConditionsType,
    });
    console.log(encryptedContent);
  };

  const decrypt = async () => {
    const did = await connectIdentity();
    const decryptionConditions = await generateAccessControlConditions();
    // const decryptionConditions = await generateUnifiedAccessControlConditions();
    // const decryptionConditions = decode(
    //   "W3siY29uZGl0aW9uVHlwZSI6ImV2bUJhc2ljIiwiY29udHJhY3RBZGRyZXNzIjoiIiwic3RhbmRhcmRDb250cmFjdFR5cGUiOiJTSVdFIiwiY2hhaW4iOiJwb2x5Z29uIiwibWV0aG9kIjoiIiwicGFyYW1ldGVycyI6WyI6cmVzb3VyY2VzIl0sInJldHVyblZhbHVlVGVzdCI6eyJjb21wYXJhdG9yIjoiY29udGFpbnMiLCJ2YWx1ZSI6ImNlcmFtaWM6Ly8qP21vZGVsPWtqemw2aHZmcmJ3NmM1MmQxZnRlMm1tZmh5MXpxNTQ3NTE3MzRjZTNycmR3d3JtdG40N3YyOTVjbzVsZ244dyJ9fSx7Im9wZXJhdG9yIjoiYW5kIn0seyJjb25kaXRpb25UeXBlIjoiZXZtQmFzaWMiLCJjb250cmFjdEFkZHJlc3MiOiIiLCJzdGFuZGFyZENvbnRyYWN0VHlwZSI6IlNJV0UiLCJjaGFpbiI6InBvbHlnb24iLCJtZXRob2QiOiIiLCJwYXJhbWV0ZXJzIjpbIjpyZXNvdXJjZXMiXSwicmV0dXJuVmFsdWVUZXN0Ijp7ImNvbXBhcmF0b3IiOiJjb250YWlucyIsInZhbHVlIjoiY2VyYW1pYzovLyo_bW9kZWw9a2p6bDZodmZyYnc2YzdsenFzaTk3Z3Fobm8wZm45eHAyMXdncDk0a2UyZzJxNGVybjB3Znk0cmw1M2FlNmNrIn19LHsib3BlcmF0b3IiOiJhbmQifSx7ImNvbmRpdGlvblR5cGUiOiJldm1CYXNpYyIsImNvbnRyYWN0QWRkcmVzcyI6IiIsInN0YW5kYXJkQ29udHJhY3RUeXBlIjoiU0lXRSIsImNoYWluIjoicG9seWdvbiIsIm1ldGhvZCI6IiIsInBhcmFtZXRlcnMiOlsiOnJlc291cmNlcyJdLCJyZXR1cm5WYWx1ZVRlc3QiOnsiY29tcGFyYXRvciI6ImNvbnRhaW5zIiwidmFsdWUiOiJjZXJhbWljOi8vKj9tb2RlbD1ranpsNmh2ZnJidzZjOGpobW84MW1tcmU0YjVnd2hvaTkydWJhMXkzeHg2bG5ubnh6eGlidGg3eXI5amtxMG4ifX0seyJvcGVyYXRvciI6ImFuZCJ9LFt7ImNvbnRyYWN0QWRkcmVzcyI6IjB4RmQyYUM0ODQ1MjVBYUEwMkQxMTJlQzRjODdFYkE2QjE3YzdEQ0RDMSIsImNvbmRpdGlvblR5cGUiOiJldm1Db250cmFjdCIsImZ1bmN0aW9uTmFtZSI6ImlzQ29sbGVjdGVkIiwiZnVuY3Rpb25QYXJhbXMiOlsiOnVzZXJBZGRyZXNzIl0sImZ1bmN0aW9uQWJpIjp7ImlucHV0cyI6W3siaW50ZXJuYWxUeXBlIjoiYWRkcmVzcyIsIm5hbWUiOiJ1c2VyIiwidHlwZSI6ImFkZHJlc3MifV0sIm5hbWUiOiJpc0NvbGxlY3RlZCIsIm91dHB1dHMiOlt7ImludGVybmFsVHlwZSI6ImJvb2wiLCJuYW1lIjoiIiwidHlwZSI6ImJvb2wifV0sInN0YXRlTXV0YWJpbGl0eSI6InZpZXciLCJ0eXBlIjoiZnVuY3Rpb24ifSwiY2hhaW4iOiJtdW1iYWkiLCJyZXR1cm5WYWx1ZVRlc3QiOnsia2V5IjoiIiwiY29tcGFyYXRvciI6Ij0iLCJ2YWx1ZSI6InRydWUifX0seyJvcGVyYXRvciI6Im9yIn0seyJjb25kaXRpb25UeXBlIjoiZXZtQmFzaWMiLCJjb250cmFjdEFkZHJlc3MiOiIiLCJzdGFuZGFyZENvbnRyYWN0VHlwZSI6IiIsImNoYWluIjoicG9seWdvbiIsIm1ldGhvZCI6IiIsInBhcmFtZXRlcnMiOlsiOnVzZXJBZGRyZXNzIl0sInJldHVyblZhbHVlVGVzdCI6eyJjb21wYXJhdG9yIjoiPSIsInZhbHVlIjoiMHhBNDgwNzdFZjQ2ODAzMzRkYzU3M0IzQTkzMjJkMzUwZDdhMjc3MDlkIn19XV0"
    // ) as DecryptionConditions;
    console.log(decryptionConditions);
    const decryptionConditionsType =
      DecryptionConditionsTypes.AccessControlCondition;

    const encryptedContent =
      "SrcDNw4p-X_1AgG3rtzG8_zv4jt7IhEUcxaXtLFS_DE3BKIvUKjc5v7osNM7Uzl8Y1F1C3adT9RK3CpB5l6w-KOeMrRzptjDIBydRB_h2lmxdxjX9MNpj71vkg0lz6XQSq3ypmH0_4FPzXJ624NLfohNZLbpro6Jbv803LhxtGr-NifNPAvaj_LsU3zc2VdXvLOlPlPPrKSpKEym85WC5rjMoC-0TDAtDLc4Y2FKgs5ZwPV4OvPJ9uw_YM1qwWMMFLV_Inxw8WzVlTKj8tfqKyfc4DThnoa6M8Cne8wsT3Z8F4aH60RlGPsjYUjR0UM5cALBV3JqSmwf7Mpm0wKgJBkA4DRIDRC_yWwmLCVHYIEBLnOzj7D9Kwk1blJaHJs--vbGXk46VJ4rwdn616PIhoLsA-tzrAE3kIcuh4QyebSq3Sf598A96CS9G8GVADYB85FOU_V3s8n29Ag2ftDrtG46Q1vswgXsxrRUaAQAlWR93WfEh5Vo3dBZj4walgkDrgEuP4djs45mUP4cqov6RtzsV08iG35Z0PFJva1DoW9q1ZWz9kRKvWPOKqQvspsoCtR37_HhhkQVSIxrpFW1ri3cVSDo_4rjDex3PUrLxbzS17dtKjsTQ6Us1b9C5bDTohJlGnpJKdSPCugb4ZeOJKYfcrlQUu8mLfSzGM13sVU=";
    const symmetricKeyInBase16Format =
      "b2153aa8b3a733c881cc2648310fe777036e38ec3c68b6bafa91633b577062f9";
    const encryptedSymmetricKey =
      "a3a328fff5dc75a4fdbb5379e06597d7b28e0da48b4ccae40fd29ab797a1822dee0a2e9a85faa2c9b24e4ffc7d45ce0f60e54fe0ab31f3d6ba03c051aebb4ae080bb025faadc299d49325172ac2f8f7bef39fabe00be00d782386cba0c7bf18f5268aff09cece700f41af20eb293c94ec1654d74baf9fb3c94bd4db52c390ecc000000000000002046b183b333424553c1ca8924d54002b5def910f1f4a9411bb9d669217d74e7295768ea89d7bbd44b046f351a0cc95f8c";

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

  /*** Post ***/
  const loadStream = async () => {
    const stream = await runtimeConnector.loadStream({
      appName: "test001",
      streamId:
        "kjzl6kcym7w8yafvxqtfrbzl70mcphjrt1fxqsvfnz0icroykmf22enl2mz9eet",
    });
    console.log(stream);
  };

  const loadStreamsByModel = async () => {
    const streams = await runtimeConnector.loadStreamsByModel({
      appName,
      modelName,
    });
    console.log(streams);
    // const res = Object.values(streams).filter(
    //   (el) => el.controller !== did && el.fileType === FileType.Datatoken
    // );
    // console.log(res);
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

  const getModelBaseInfo = async () => {
    const res = await runtimeConnector.getModelBaseInfo(
      "kjzl6hvfrbw6c7ft23trwmoox36eo7mnxlsj1dad2574bjm6c6fon8pmoqhp7br"
    );
    console.log(res);
  };

  const createPublicPostStream = async () => {
    const date = new Date().toISOString();

    const { streamContent, streamId, newMirror, existingMirror } =
      await runtimeConnector.createStream({
        did,
        appName,
        modelName,
        streamContent: {
          appVersion: postVersion,
          text: "hello",
          images: [
            "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
          ],
          videos: [],
          createdAt: date,
          updatedAt: date,
          encrypted: JSON.stringify({
            text: false,
            images: false,
            videos: false,
          }),
        },
        fileType: FileType.Public,
      });

    if (!newMirror && !existingMirror) {
      throw "Failed to create content";
    }

    (existingMirror || newMirror)!.mirrorFile.content = streamContent;

    const contentObject = {
      content: (existingMirror || newMirror)!.mirrorFile,
      contentId: streamId,
    };

    console.log(contentObject);
    return contentObject;
  };

  const createPrivatePostStream = async () => {
    const date = new Date().toISOString();

    const res = await runtimeConnector.createStream({
      did,
      appName,
      modelName,
      streamContent: {
        appVersion: postVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        ],
        videos: [],
        createdAt: date,
        updatedAt: date,
        encrypted: JSON.stringify({
          text: false,
          images: false,
          videos: false,
        }),
      },
      fileType: FileType.Private,
    });
  };

  const createDatatokenPostStream = async () => {
    const profileId = await getProfileId({ did, lensNickName: "hello" });

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
      did,
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
    did,
    lensNickName,
  }: {
    did: string;
    lensNickName?: string;
  }) => {
    const lensProfiles = await runtimeConnector.getLensProfiles(
      getAddressFromDid(did)
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
      profileId = await runtimeConnector.createLensProfile(lensNickName);
    }

    return profileId;
  };

  const monetizePost = async () => {
    const contentId =
      "kjzl6kcym7w8y78cluptg8m0hs3qftjvkxwgn49jksqkolxkpvczw6917p2fvsa";

    const res = await monetizeContent({
      did,
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
    did,
    contentId,
    lensNickName,
    profileId,
    mirrorFile,
    encrypted,
    currency,
    amount,
    collectLimit,
  }: {
    did: string;
    contentId: string;
    lensNickName?: string;
    mirrorFile?: MirrorFile;
    profileId?: string;
    encrypted: object;
    currency: Currency;
    amount: number;
    collectLimit: number;
  }) => {
    let datatokenId;
    if (!profileId) {
      profileId = await getProfileId({ did, lensNickName });
    }
    if (!mirrorFile) {
      const res = await runtimeConnector.loadStream({
        appName,
        streamId: contentId,
      });
      mirrorFile = res.streamContent;
    }

    try {
      const datatoken = await runtimeConnector.createDatatoken({
        profileId,
        streamId: mirrorFile!.indexFileId,
        currency,
        amount,
        collectLimit,
      });
      datatokenId = datatoken.datatokenId;
    } catch (error: any) {
      console.log(error);
      if (
        error !==
        "networkConfigurationId undefined does not match a configured networkConfiguration"
      ) {
        await deletePost({ did, content: mirrorFile! });
      }
      throw error;
    }

    (mirrorFile!.content as { encrypted: string }).encrypted =
      JSON.stringify(encrypted);
    (mirrorFile!.content as { updatedAt: string }).updatedAt =
      new Date().toISOString();

    const res = await runtimeConnector.updateStreams({
      appName,
      streamsRecord: {
        [contentId]: {
          streamContent: mirrorFile!.content,
          fileType: FileType.Datatoken,
          ...(datatokenId && { datatokenId }),
        },
      },
      syncImmediately: true,
    });

    if (!res?.successRecord?.[contentId]) {
      throw {
        failureRecord: res?.failureRecord,
        failureReason: res?.failureReason,
      };
    }

    console.log(res);
  };

  const updatePostFromPrivateToPublic = async () => {
    const contentId =
      "kjzl6kcym7w8y78cluptg8m0hs3qftjvkxwgn49jksqkolxkpvczw6917p2fvsa";

    const encrypted = JSON.stringify({
      text: false,
      images: false,
      videos: false,
    });

    const res = await runtimeConnector.updateStreams({
      appName,
      streamsRecord: {
        [contentId]: {
          streamContent: {
            encrypted: JSON.stringify(encrypted),
          },
          fileType: FileType.Public,
        },
      },
      syncImmediately: true,
    });

    if (!res?.successRecord?.[contentId]) {
      throw {
        failureRecord: res?.failureRecord,
        failureReason: res?.failureReason,
      };
    }
    console.log(res);
  };

  const updatePostFromPublicToPrivate = async () => {
    const contentId =
      "kjzl6kcym7w8y78cluptg8m0hs3qftjvkxwgn49jksqkolxkpvczw6917p2fvsa";

    const encrypted = JSON.stringify({
      text: true,
      images: true,
      videos: false,
    });

    const res = await runtimeConnector.updateStreams({
      appName,
      streamsRecord: {
        [contentId]: {
          streamContent: {
            encrypted: JSON.stringify(encrypted),
          },
          fileType: FileType.Private,
        },
      },

      syncImmediately: true,
    });

    if (!res?.successRecord?.[contentId]) {
      throw {
        failureRecord: res?.failureRecord,
        failureReason: res?.failureReason,
      };
    }

    console.log(res);
  };

  const updatePublicContent = async () => {
    const contentId =
      "kjzl6kcym7w8y78cluptg8m0hs3qftjvkxwgn49jksqkolxkpvczw6917p2fvsa";

    const encrypted = JSON.stringify({
      text: false,
      images: false,
      videos: false,
    });

    const res = await runtimeConnector.updateStreams({
      appName,
      streamsRecord: {
        [contentId]: {
          streamContent: {
            text: "update my post -- " + new Date().toISOString(),
            images: [
              "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link",
            ],
            encrypted: JSON.stringify(encrypted),
          },
        },
      },
      syncImmediately: true,
    });

    if (!res?.successRecord?.[contentId]) {
      throw {
        failureRecord: res?.failureRecord,
        failureReason: res?.failureReason,
      };
    }

    console.log(res);
  };

  const updatePrivateOrDatatokenContent = async () => {
    const contentId =
      "kjzl6kcym7w8y78cluptg8m0hs3qftjvkxwgn49jksqkolxkpvczw6917p2fvsa";

    const encrypted = JSON.stringify({
      text: true,
      images: true,
      videos: false,
    });

    const res = await runtimeConnector.updateStreams({
      appName,
      streamsRecord: {
        [contentId]: {
          streamContent: {
            text: "update my post -- " + new Date().toISOString(),
            images: [
              "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link",
            ],
            encrypted: JSON.stringify(encrypted),
          },
        },
      },
      syncImmediately: true,
    });

    if (!res?.successRecord?.[contentId]) {
      throw {
        failureRecord: res?.failureRecord,
        failureReason: res?.failureReason,
      };
    }

    console.log(res);
  };

  const deletePost = async ({
    did,
    content,
  }: {
    did: string;
    content: MirrorFile;
  }) => {
    const res = await runtimeConnector.removeMirrors({
      did,
      appName,
      mirrorIds: [content.indexFileId],
    });
    return res;
  };

  /*** Post ***/

  /*** Folders ***/
  const readOthersFolders = async () => {
    const othersFolders = await runtimeConnector.readFolders({
      did: "did:pkh:eip155:137:0x3F3cceEbDfE3f5E640fDD11854855C7A32dced33",
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
        "kjzl6kcym7w8y9k8byiqo3p1ydrpgopncdamqp9yanzus7duyxj1x07ms1cc6wi",
      newFolderName: new Date().toISOString(),
      newFolderDescription: new Date().toISOString(),
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

  const deleteFolder = async () => {
    const res = await runtimeConnector.deleteFolder({
      did,
      appName,
      folderId:
        "kjzl6kcym7w8y6pjw6yjnr9hbkeh025jrwe4hoqfscrwmpn6bx064rywv8qxavl",
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
        "kjzl6kcym7w8y7k2u3s9euekveiao5u386qxnpe51g6zpqds1kdsn6kdoivu6sh",
      folderDescription: "This is a datatoken folder.",
      datatokenVars: {
        profileId: "0x0219",
        streamId:
          "kjzl6kcym7w8y7k2u3s9euekveiao5u386qxnpe51g6zpqds1kdsn6kdoivu6sh",
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
      folderId:
        "kjzl6kcym7w8y7k2u3s9euekveiao5u386qxnpe51g6zpqds1kdsn6kdoivu6sh",
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
        profileId: "0x0219",
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

  const createLensProfile = async () => {
    const res = await runtimeConnector.createLensProfile("jackie2");
    console.log(res);
  };

  const getLensProfiles = async () => {
    const res = await runtimeConnector.getLensProfiles(
      "0xA48077Ef4680334dc573B3A9322d350d7a27709d"
    );
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
      indexFileId:
        "kjzl6kcym7w8y65io6cihifwm4yqx9ochcaoq0934yeivmmbkht7cj780fxq7zo",
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

  const unlock = async () => {
    const indexFileId =
      "kjzl6kcym7w8y65io6cihifwm4yqx9ochcaoq0934yeivmmbkht7cj780fxq7zo";
    const res = await runtimeConnector.unlock({ did, appName, indexFileId });
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
      <button onClick={getCurrentWallet}>getCurrentWallet</button>
      <hr />
      <button onClick={switchNetwork}>switchNetwork</button>
      <hr />
      <button onClick={ethereumRequest}>ethereumRequest</button>
      <hr />
      <button onClick={signerSign}>signerSign</button>
      <hr />
      <button onClick={contractCall}>contractCall</button>
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
      <button onClick={getModelBaseInfo}>getModelBaseInfo</button>
      <button onClick={createPublicPostStream}>createPublicPostStream</button>
      <button onClick={createPrivatePostStream}>createPrivatePostStream</button>
      <button onClick={createDatatokenPostStream}>
        createDatatokenPostStream
      </button>
      <button onClick={monetizePost}>monetizePost</button>
      <button onClick={updatePostFromPrivateToPublic}>
        updatePostFromPrivateToPublic
      </button>
      <button onClick={updatePostFromPublicToPrivate}>
        updatePostFromPublicToPrivate
      </button>
      <button onClick={updatePublicContent}>updatePublicContent</button>
      <button onClick={updatePrivateOrDatatokenContent}>
        updatePrivateOrDatatokenContent
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
      <button onClick={createLensProfile}>createLensProfile</button>
      <button onClick={getLensProfiles}>getLensProfiles</button>
      <button onClick={createDatatoken}>createDatatoken</button>
      <button onClick={collect}>collect</button>
      <button onClick={isCollected}>isCollected</button>
      <button onClick={getDatatokenMetadata}>getDatatokenMetadata</button>
      <button onClick={unlock}>unlock</button>
      <br />
      <br />
      <button onClick={migrateOldFolders}>migrateOldFolders</button>
    </div>
  );
}

export default App;
