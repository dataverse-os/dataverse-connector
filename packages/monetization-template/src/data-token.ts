import { ethers, Signer } from "ethers";
import { AssetType, DatatokenVars } from "./types";
import { nanoid } from "nanoid";
import { uploadToIPFS } from "@dataverse/utils";
import {
  DataTokenFactory,
  CreateDataTokenInput,
  DataToken,
  ChainId,
  GraphType as DataTokenType,
  DataTokenGraphType
} from "@dataverse/contracts-sdk/data-token";
import {
  DataverseConnector,
  SYSTEM_CALL,
  BooleanCondition,
  DecryptionConditions,
  DecryptionConditionsType,
  EncryptionProtocol,
  MonetizationProvider,
  UnifiedAccessControlCondition
} from "@dataverse/dataverse-connector";
import { contractCall, getChainNameFromChainId } from "./util";

export class Datatoken {
  dataverseConnector: DataverseConnector;

  constructor(dataverseConnector: DataverseConnector) {
    this.dataverseConnector = dataverseConnector;
  }

  async getAssetHandler({
    fileOrFolderId,
    dataTokenVars,
    // unionFolderId,
    // unlockingTimeStamp,
    signer
  }: {
    fileOrFolderId?: string;
    dataTokenVars?: DatatokenVars;
    // unionFolderId?: string;
    // unlockingTimeStamp?: number;
    signer: Signer;
  }): Promise<string> {
    const DATAVERSE_URL = "https://dataverse-os.com/";

    const POST_APP_ID = `dataverse-v0.1.0`;

    const metadata = {
      version: "2.0.0",
      metadata_id: nanoid(),
      content: `ceramic://${fileOrFolderId}`,
      locale: "en",
      mainContentFocus: "TEXT_ONLY",
      external_url: DATAVERSE_URL,
      name: "none", // cannot be empty string, otherwise metadata will not be retrived by Lens graph
      description: "",
      image: "",
      attributes: [],
      appId: POST_APP_ID
    };

    const contentURI = await uploadToIPFS(metadata, "metadata.json");

    let input = {} as CreateDataTokenInput;
    let dataTokenFactory = {} as DataTokenFactory;

    dataTokenVars = dataTokenVars as DatatokenVars<DataTokenType.Profileless>;

    const {
      chainId,
      type,
      collectModule,
      collectLimit,
      amount,
      currency,
      recipient,
      endTimestamp
    } = dataTokenVars;

    dataTokenFactory = new DataTokenFactory({
      chainId: chainId ?? ChainId.PolygonMumbai,
      signer
    });

    input = {
      type: type ?? DataTokenType.Profileless,
      contentURI,
      collectModule: collectModule ?? "LimitedFeeCollectModule",
      collectLimit: collectLimit ?? 2 ** 52,
      ...(collectModule !== "FreeCollectModule" && {
        recipient: recipient ?? (await signer.getAddress()),
        currency,
        amount: ethers.utils.parseUnits(
          String(amount),
          currency === "USDC" ? 6 : 18
        )
      }),
      ...(collectModule === "LimitedTimedFeeCollectModule" && {
        endTimestamp
      })
    };

    const { dataToken: dataTokenId } =
      await dataTokenFactory.createDataToken(input);

    return dataTokenId;
  }

  async applyMonetizerToFile({
    fileId,
    creator,
    dataTokenId,
    chainId,
    unlockingTimeStamp
  }: {
    fileId: string;
    creator: string;
    dataTokenId?: string;
    chainId?: number;
    unlockingTimeStamp?: number;
  }) {
    if (dataTokenId) {
      const monetizationProvider = {
        dataAsset: {
          assetType: AssetType[AssetType.dataToken],
          assetId: dataTokenId,
          assetContract: dataTokenId,
          chainId
        }
      };

      const decryptionConditions = await this.getAccessControlConditions({
        creator,
        unlockingTimeStamp,
        monetizationProvider
      });

      const encryptionProvider = {
        protocol: EncryptionProtocol.Lit,
        decryptionConditions,
        decryptionConditionsType:
          DecryptionConditionsType.UnifiedAccessControlCondition,
        unlockingTimeStamp
      };

      const res = await this.dataverseConnector.runOS({
        method: SYSTEM_CALL.monetizeFile,
        params: {
          fileId,
          monetizationProvider,
          encryptionProvider
        }
      });

      return res;
    }
  }

  async collectDataToken({
    contractAddress,
    abi,
    method,
    params,
    signer
  }: {
    contractAddress: string;
    abi: any[];
    method: string;
    params: any[];
    signer: Signer;
  }) {
    const res = await contractCall({
      contractAddress,
      abi,
      method,
      params,
      signer
    });

    return res;
  }

  async loadDatatokens(
    dataTokenIds: Array<string>
  ): Promise<Array<DataTokenGraphType>> {
    const res = await DataToken.loadDataTokens(dataTokenIds);
    return res;
  }

  async isDatatokenCollectedBy({
    dataTokenId,
    collector
  }: {
    dataTokenId: string;
    collector: string;
  }): Promise<boolean> {
    const res = await DataToken.isDataTokenCollectedBy({
      dataTokenId: dataTokenId,
      collector
    });
    return res;
  }

  async getAccessControlConditions({
    creator,
    unlockingTimeStamp,
    monetizationProvider
  }: {
    creator: string;
    unlockingTimeStamp?: number;
    monetizationProvider: MonetizationProvider;
  }): Promise<DecryptionConditions> {
    const conditions = [];
    const { dataAsset } = monetizationProvider;

    unlockingTimeStamp &&
      conditions.push(
        this.getTimeStampAccessControlConditions(String(unlockingTimeStamp))
      );

    const unifiedAccessControlConditions = [
      {
        conditionType: "evmBasic",
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: `${creator}`
        }
      }
    ] as (UnifiedAccessControlCondition | BooleanCondition)[];

    if (dataAsset.assetId && dataAsset.chainId) {
      unifiedAccessControlConditions.push(
        ...[
          { operator: "or" },
          this.getIsDatatokenCollectedAccessControlConditions({
            contractAddress: dataAsset.assetId,
            chain: getChainNameFromChainId(dataAsset.chainId)
          })
        ]
      );
    }

    conditions.push(unifiedAccessControlConditions);

    return conditions;
  }

  getIsDatatokenCollectedAccessControlConditions({
    contractAddress,
    chain
  }: {
    contractAddress: string;
    chain: string;
  }) {
    return {
      contractAddress,
      conditionType: "evmContract",
      functionName: "isCollected",
      functionParams: [":userAddress"],
      functionAbi: {
        inputs: [
          {
            internalType: "address",
            name: "user",
            type: "address"
          }
        ],
        name: "isCollected",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      chain,
      returnValueTest: {
        key: "",
        comparator: "=",
        value: "true"
      }
    };
  }

  getIsDataUnionSubscribedAccessControlConditions({
    contractAddress,
    chain,
    dataUnionId,
    blockNumber
  }: {
    contractAddress: string;
    chain: string;
    dataUnionId: string;
    blockNumber: number;
  }) {
    return {
      contractAddress,
      conditionType: "evmContract",
      functionName: "isAccessible",
      functionParams: [dataUnionId, ":userAddress", String(blockNumber)],
      functionAbi: {
        inputs: [
          {
            internalType: "bytes32",
            name: "dataUnionId",
            type: "bytes32"
          },
          {
            internalType: "address",
            name: "subscriber",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256"
          }
        ],
        name: "isAccessible",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      chain,
      returnValueTest: {
        key: "",
        comparator: "=",
        value: "true"
      }
    };
  }

  getTimeStampAccessControlConditions(value: string) {
    return {
      conditionType: "evmBasic",
      contractAddress: "",
      standardContractType: "timestamp",
      chain: "ethereum",
      method: "eth_getBlockByNumber",
      parameters: ["latest"],
      returnValueTest: {
        comparator: ">=",
        value
      }
    };
  }
}
