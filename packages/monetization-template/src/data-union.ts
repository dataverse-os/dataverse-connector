import { BigNumber, ethers, Signer } from "ethers";
import {
  AssetType,
  DatatokenVars,
  DataUnionVars,
  SubscribeDataUnionOutput,
  SubscribeDataUnionVars
} from "./types";
import { nanoid } from "nanoid";
import { uploadToIPFS } from "@dataverse/utils";
import {
  ChainId,
  GraphType as DataTokenType
} from "@dataverse/contracts-sdk/data-token";

import {
  DataUnion as DataUnionSDK,
  DataUnionGraphType
} from "@dataverse/contracts-sdk/data-union";
import {
  DeployedContracts,
  getTimestampByBlockNumber
} from "@dataverse/contracts-sdk";
import {
  ActionType,
  BooleanCondition,
  ContentType,
  DataverseConnector,
  DecryptionConditions,
  DecryptionConditionsType,
  EncryptionProtocol,
  ModelName,
  MonetizationProvider,
  Signal,
  StorageResource,
  SYSTEM_CALL,
  UnifiedAccessControlCondition
} from "@dataverse/dataverse-connector";
import { contractCall, getChainNameFromChainId } from "./util";

export class DataUnion {
  dataverseConnector: DataverseConnector;

  constructor(dataverseConnector: DataverseConnector) {
    this.dataverseConnector = dataverseConnector;
  }

  async getAssetHandler({
    dataUnionVars,
    signer
  }: {
    dataUnionVars: DataUnionVars;
    signer: Signer;
  }) {
    const DATAVERSE_URL = "https://dataverse-os.com/";

    const POST_APP_ID = `dataverse-v0.1.0`;

    const metadata = {
      version: "2.0.0",
      metadata_id: nanoid(),
      content: `ceramic://${dataUnionVars.dataTokenVars.streamId}`,
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

    const {
      chainId,
      type,
      collectModule,
      collectLimit,
      amount,
      currency,
      recipient,
      endTimestamp
    } = dataUnionVars.dataTokenVars as DatatokenVars<DataTokenType.Profileless>;

    const dataUnion = new DataUnionSDK({
      chainId: chainId ?? ChainId.PolygonMumbai,
      signer
    });

    const creator = await signer.getAddress();

    const input = {
      type: type ?? DataTokenType.Profileless,
      contentURI,
      collectModule: collectModule ?? "LimitedFeeCollectModule",
      collectLimit: collectLimit ?? 2 ** 52,
      recipient: recipient ?? creator,
      currency,
      amount: ethers.utils.parseUnits(
        String(amount),
        currency === "USDC" ? 6 : 18
      ),
      endTimestamp
    };

    const { subscribeModule, subscribeModuleInput } = dataUnionVars;

    const { dataUnionId } = await dataUnion.publish({
      createDataTokenInput: input,
      resourceId: "test-resource-1",
      subscribeModule,
      subscribeModuleInput: {
        ...subscribeModuleInput,
        amount: ethers.utils.parseEther(String(subscribeModuleInput.amount))
      }
    });

    return dataUnionId;
  }

  async applyMonetizerToFolder({
    folderId,
    dataUnionId,
    chainId,
    signal
  }: {
    folderId?: string;
    dataUnionId?: string;
    chainId?: number;
    signal?: Signal;
  }) {
    const monetizationProvider = {
      dataAsset: {
        assetType: AssetType[AssetType.dataUnion],
        assetId: dataUnionId,
        assetContract: DeployedContracts[ChainId[chainId]].DataUnion.DataUnion,
        chainId
      }
    };

    const res = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.monetizeFolder,
      params: {
        folderId,
        monetizationProvider,
        signal
      }
    });

    return res;
  }

  async applyMonetizerToFile({
    fileId,
    creator,
    unionFolderId,
    blockNumber
  }: {
    fileId?: string;
    creator?: string;
    unionFolderId?: string;
    blockNumber?: number;
  }) {
    const dataUnion = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.loadDataUnionById,
      params: unionFolderId
    });
    const linkedAsset =
      dataUnion.accessControl?.monetizationProvider?.dataAsset;

    const fileRes = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFile,
      params: fileId
    });
    const file = fileRes?.fileContent?.file;
    if (!file) {
      throw new Error("The fileId does not exsit or has been deleted");
    }

    const modelId = fileRes?.modelId;
    const dapp = await this.dataverseConnector.getDAppInfo(fileRes?.appId);
    const indexFileModelId =
      this.dataverseConnector.getModelIdByAppIdAndModelName({
        dapp,
        modelName: ModelName.indexFile
      });
    const actionFileModelId =
      this.dataverseConnector.getModelIdByAppIdAndModelName({
        dapp,
        modelName: ModelName.actionFile
      });

    if (
      (modelId === indexFileModelId &&
        file.contentType.resource === StorageResource.IPFS &&
        dataUnion.options.signal &&
        (dataUnion.options.signal as ContentType).resource !==
          StorageResource.IPFS) ||
      (modelId === indexFileModelId &&
        file.contentType.resource === StorageResource.CERAMIC &&
        dataUnion.options.signal &&
        (dataUnion.options.signal as ContentType).resource !==
          StorageResource.CERAMIC) ||
      (modelId === actionFileModelId &&
        dataUnion.options.signal &&
        !((dataUnion.options.signal as ActionType) in ActionType))
    ) {
      throw new Error(
        "The file type that the data union can store does not match the current file type"
      );
    }

    const unlockingTimestamp = await getTimestampByBlockNumber({
      chainId: linkedAsset.chainId,
      blockNumber
    });

    const monetizationProvider = {
      dependency: {
        linkedAsset,
        blockNumber
      }
    };

    const decryptionConditions = await this.getAccessControlConditions({
      creator,
      unlockingTimestamp,
      monetizationProvider
    });

    const encryptionProvider = {
      protocol: EncryptionProtocol.Lit,
      decryptionConditions,
      decryptionConditionsType:
        DecryptionConditionsType.UnifiedAccessControlCondition,
      unlockingTimestamp
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

  async collectDataUnion({
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

  async subscribeDataUnion({
    subscribeDataUnionVars,
    signer
  }: {
    subscribeDataUnionVars: SubscribeDataUnionVars & { chainId: ChainId };
    signer: Signer;
  }): Promise<SubscribeDataUnionOutput> {
    const { chainId, dataUnionId, collectTokenId, subscribeInput } =
      subscribeDataUnionVars;

    const dataUnion = new DataUnionSDK({
      chainId,
      signer
    });

    const res = await dataUnion.subscribe({
      dataUnionId,
      collectTokenId,
      subscribeInput
    });

    return {
      dataUnionId: res.dataUnionId as string,
      collectTokenId: res.collectTokenId.toHexString(),
      subscribeModule: res.subscribeModule,
      startAt: res.startAt.toNumber(),
      endAt: res.endAt.toNumber()
    };
  }

  async loadDataUnions(
    dataUnionIds: Array<string>
  ): Promise<Array<DataUnionGraphType>> {
    const res = await DataUnionSDK.loadDataUnions(dataUnionIds);
    return res;
  }

  async isDataUnionCollectedBy({
    dataUnionId,
    collector
  }: {
    dataUnionId: string;
    collector: string;
  }): Promise<boolean> {
    const res = await DataUnionSDK.isDataUnionCollectedBy({
      dataUnionId,
      collector
    });
    return res;
  }

  async isDataUnionSubscribedBy({
    dataUnionId,
    subscriber,
    blockNumber,
    timestamp
  }: {
    dataUnionId: string;
    subscriber: string;
    blockNumber?: number;
    timestamp?: number;
  }): Promise<boolean> {
    const res = await DataUnionSDK.isDataUnionSubscribedBy({
      dataUnionId,
      subscriber,
      ...(blockNumber && { blockNumber: BigNumber.from(blockNumber) }),
      ...(timestamp && { timestamp: BigNumber.from(timestamp) })
    });
    return res;
  }

  async getAccessControlConditions({
    creator,
    unlockingTimestamp,
    monetizationProvider
  }: {
    creator: string;
    unlockingTimestamp?: number;
    monetizationProvider: MonetizationProvider;
  }): Promise<DecryptionConditions> {
    const conditions = [];
    const {
      dependency: { linkedAsset, blockNumber }
    } = monetizationProvider;

    unlockingTimestamp &&
      conditions.push(
        this.getTimestampAccessControlConditions(String(unlockingTimestamp))
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

    if (
      linkedAsset.assetId &&
      linkedAsset.assetContract &&
      linkedAsset.chainId &&
      blockNumber
    ) {
      unifiedAccessControlConditions.push(
        ...[
          { operator: "or" },
          this.getIsDataUnionSubscribedAccessControlConditions({
            contractAddress: linkedAsset.assetContract,
            chain: getChainNameFromChainId(linkedAsset.chainId),
            dataUnionId: linkedAsset.assetId,
            blockNumber
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

  getTimestampAccessControlConditions(value: string) {
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
