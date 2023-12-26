import { ethers, Signer } from "ethers";
import {
  BooleanCondition,
  CollectDatatokenOutput,
  CreateDatatokenOutput,
  DatatokenVars,
  DecryptionConditions,
  DecryptionConditionsTypes,
  EncryptionProtocol,
  EncryptionProvider,
  MonetizationProvider,
  UnifiedAccessControlCondition
} from "./types";
import { nanoid } from "nanoid";
import { uploadToIPFS } from "@dataverse/utils";
import {
  DataTokenFactory,
  CreateDataTokenInput,
  DataToken,
  ChainId,
  GraphType as DataTokenType,
  DataTokenGraphType,
  Datatoken_Collector
} from "@dataverse/contracts-sdk/data-token";
import { Lit } from "./lit";
import { getBlockNumberByTimestamp } from "@dataverse/contracts-sdk";

export class Datatoken {
  lit: Lit;

  constructor(lit: Lit) {
    this.lit = lit;
  }

  async createDatatoken({
    signer,
    datatokenVars
  }: {
    signer: Signer;
    datatokenVars: DatatokenVars;
  }): Promise<CreateDatatokenOutput> {
    const DATAVERSE_URL = "https://dataverse-os.com/";

    const POST_APP_ID = `dataverse-v0.1.0`;

    const metadata = {
      version: "2.0.0",
      metadata_id: nanoid(),
      content: `ceramic://${datatokenVars.streamId}`,
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

    datatokenVars = datatokenVars as DatatokenVars<DataTokenType.Profileless>;
    const {
      chainId,
      type,
      collectModule,
      collectLimit,
      amount,
      currency,
      recipient,
      endTimestamp
    } = datatokenVars;
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

    const { dataToken, ...rest } =
      await dataTokenFactory.createDataToken(input);

    return { datatokenId: dataToken, ...rest };
  }

  async collectDatatoken({
    datatokenId,
    chainId,
    profileId,
    signer
  }: {
    datatokenId: string;
    chainId: ChainId;
    profileId?: string;
    signer: Signer;
  }): Promise<CollectDatatokenOutput> {
    const dataTokenSDK = new DataToken({
      chainId,
      dataTokenAddress: datatokenId,
      signer
    });

    const { dataToken, ...rest } = await dataTokenSDK.collect(profileId);

    return { datatokenId: dataToken, ...rest };
  }

  async loadDatatokensCreatedBy(
    creator: string
  ): Promise<Array<DataTokenGraphType>> {
    const res = await DataToken.loadDataTokensCreatedBy(creator);
    return res;
  }

  async loadDatatokensCollectedBy(
    collector: string
  ): Promise<Array<DataTokenGraphType>> {
    const res = await DataToken.loadDataTokensCollectedBy(collector);
    return res;
  }

  async loadDatatoken(datatokenId: string): Promise<DataTokenGraphType> {
    const res = await DataToken.loadDataToken(datatokenId);
    return res;
  }

  async loadDatatokens(
    datatokenIds: Array<string>
  ): Promise<Array<DataTokenGraphType>> {
    const res = await DataToken.loadDataTokens(datatokenIds);
    return res;
  }

  async loadDatatokenCollectors(
    datatokenId: string
  ): Promise<Datatoken_Collector[]> {
    const res = await DataToken.loadDataTokenCollectors(datatokenId);
    return res;
  }

  async isDatatokenCollectedBy({
    datatokenId,
    collector
  }: {
    datatokenId: string;
    collector: string;
  }): Promise<boolean> {
    const res = await DataToken.isDataTokenCollectedBy({
      dataTokenId: datatokenId,
      collector
    });
    return res;
  }

  async generateAccessControlConditions({
    address,
    datatokenId,
    dataUnionIds,
    datatokenChainId,
    unlockingTimeStamp,
    dataUnionChainId,
    unionContractAddress,
    blockNumber
  }: {
    address: string;
    datatokenId?: string;
    dataUnionIds?: string[];
    datatokenChainId?: number;
    unlockingTimeStamp?: string;
    dataUnionChainId?: number;
    unionContractAddress?: string;
    blockNumber?: number;
  }): Promise<DecryptionConditions> {
    const conditions = [];

    unlockingTimeStamp &&
      conditions.push(
        this.lit.generateTimeStampAccessControlConditions(
          String(unlockingTimeStamp)
        )
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
          value: `${address}`
        }
      }
    ] as (UnifiedAccessControlCondition | BooleanCondition)[];

    let datatokenChainName: string;
    if (datatokenId && datatokenChainId) {
      datatokenChainName =
        await this.lit.getChainNameFromChainId(datatokenChainId);
    }

    datatokenId &&
      unifiedAccessControlConditions.push(
        ...[
          { operator: "or" },
          this.lit.generateIsDatatokenCollectedAccessControlConditions({
            contractAddress: datatokenId,
            chain: datatokenChainName
          })
        ]
      );

    let dataUnionChainName: string;
    if (dataUnionIds && dataUnionChainId) {
      dataUnionChainName =
        await this.lit.getChainNameFromChainId(dataUnionChainId);
    }

    dataUnionIds &&
      unifiedAccessControlConditions.push(
        ...dataUnionIds
          .map((dataUnionId) => {
            return [
              { operator: "or" },
              this.lit.generateIsDataUnionSubscribedAccessControlConditions({
                contractAddress: unionContractAddress,
                chain: dataUnionChainName,
                dataUnionId,
                blockNumber
              })
            ];
          })
          .flat()
      );

    conditions.push(unifiedAccessControlConditions);

    return conditions;
  }

  async generateMonetizationProvider({
    chainId,
    datatokenId,
    dataUnionIds,
    unlockingTimeStamp
  }: {
    chainId?: ChainId;
    datatokenId?: string;
    dataUnionIds?: string[];
    unlockingTimeStamp?: string;
  }): Promise<MonetizationProvider> {
    return {
      ...(datatokenId && {
        protocol: DataTokenType.Profileless,
        chainId,
        datatokenId
      }),
      ...(dataUnionIds &&
        dataUnionIds.length > 0 && {
          dataUnionIds,
          blockNumber: await getBlockNumberByTimestamp({
            chainId,
            timestamp: Date.now() / 1000
          })
        }),
      ...(unlockingTimeStamp && { unlockingTimeStamp })
    };
  }

  generateEncryptionProvider(
    decryptionConditions?: DecryptionConditions
  ): EncryptionProvider {
    return {
      protocol: EncryptionProtocol.Lit,
      decryptionConditions,
      decryptionConditionsType:
        DecryptionConditionsTypes.UnifiedAccessControlCondition
    };
  }
}
