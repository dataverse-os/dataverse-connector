import { BigNumber, ethers, Signer } from "ethers";
import {
  BooleanCondition,
  CollectDataUnionOutput,
  CreateDataUnionOutput,
  DatatokenVars,
  DataUnionVars,
  DecryptionConditions,
  MonetizationProvider,
  SubscribeDataUnionOutput,
  SubscribeDataUnionVars,
  UnifiedAccessControlCondition
} from "./types";
import { nanoid } from "nanoid";
import { uploadToIPFS } from "@dataverse/utils";
import {
  ChainId,
  GraphType as DataTokenType,
  CreateDataTokenInput
} from "@dataverse/contracts-sdk/data-token";

import {
  DataUnion as DataUnionSDK,
  DataUnionGraphType,
  Data_Union_Subscriber
} from "@dataverse/contracts-sdk/data-union";
import { Lit } from "./lit";
import { DeployedContracts } from "@dataverse/contracts-sdk";

export class DataUnion {
  lit: Lit;

  constructor(lit: Lit) {
    this.lit = lit;
  }

  async createDataUnion({
    signer,
    dataUnionVars
  }: {
    signer: Signer;
    dataUnionVars: DataUnionVars;
  }): Promise<CreateDataUnionOutput> {
    const DATAVERSE_URL = "https://dataverse-os.com/";

    const POST_APP_ID = `dataverse-v0.1.0`;

    const metadata = {
      version: "2.0.0",
      metadata_id: nanoid(),
      content: `ceramic://${dataUnionVars.datatokenVars.streamId}`,
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

    let input = {} as CreateDataTokenInput<DataTokenType.Profileless>;
    let dataUnion = {} as DataUnionSDK;

    const {
      chainId,
      type,
      collectModule,
      collectLimit,
      amount,
      currency,
      recipient,
      endTimestamp
    } = dataUnionVars.datatokenVars as DatatokenVars<DataTokenType.Profileless>;

    dataUnion = new DataUnionSDK({
      chainId: chainId ?? ChainId.PolygonMumbai,
      signer
    });

    input = {
      type: type ?? DataTokenType.Profileless,
      contentURI,
      collectModule: collectModule ?? "LimitedFeeCollectModule",
      collectLimit: collectLimit ?? 2 ** 52,
      recipient: recipient ?? (await signer.getAddress()),
      currency,
      amount: ethers.utils.parseUnits(
        String(amount),
        currency === "USDC" ? 6 : 18
      ),
      endTimestamp
    };

    const { resourceId, subscribeModule, subscribeModuleInput } = dataUnionVars;

    const { dataToken, ...rest } = await dataUnion.publish({
      createDataTokenInput: input,
      resourceId: "test-resource-1",
      subscribeModule,
      subscribeModuleInput: {
        ...subscribeModuleInput,
        amount: ethers.utils.parseEther(String(subscribeModuleInput.amount))
      }
    });

    return { datatokenId: dataToken, ...rest };
  }

  async collectDataUnion({
    dataUnionId,
    chainId,
    signer
  }: {
    dataUnionId: string;
    chainId: ChainId;
    signer: Signer;
  }): Promise<CollectDataUnionOutput> {
    const dataUnion = new DataUnionSDK({
      chainId,
      signer
    });

    const { dataToken, ...rest } = await dataUnion.collect(dataUnionId);

    return { datatokenId: dataToken, ...rest };
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

  async loadDataUnionsPublishedBy(
    publisher: string
  ): Promise<Array<DataUnionGraphType>> {
    const res = await DataUnionSDK.loadDataUnionsPublishedBy(publisher);
    return res;
  }

  async loadDataUnionsCollectedBy(
    collector: string
  ): Promise<Array<DataUnionGraphType>> {
    const res = await DataUnionSDK.loadDataUnionsCollectedBy(collector);
    return res;
  }

  async loadDataUnion(dataUnionId: string): Promise<DataUnionGraphType> {
    const res = await DataUnionSDK.loadDataUnion(dataUnionId);
    return res;
  }

  async loadDataUnions(
    dataUnionIds: Array<string>
  ): Promise<Array<DataUnionGraphType>> {
    const res = await DataUnionSDK.loadDataUnions(dataUnionIds);
    return res;
  }

  async loadDataUnionCollectors(
    dataUnionId: string
  ): Promise<Array<Data_Union_Subscriber>> {
    const res = await DataUnionSDK.loadDataUnionCollectors(dataUnionId);
    return res;
  }

  async loadDataUnionSubscribers(
    dataUnionId: string
  ): Promise<Array<Data_Union_Subscriber>> {
    const res = await DataUnionSDK.loadDataUnionSubscribers(dataUnionId);
    return res;
  }

  async loadDataUnionSubscriptionsBy({
    dataUnionId,
    collector
  }: {
    dataUnionId: string;
    collector: string;
  }): Promise<Array<Data_Union_Subscriber>> {
    const res = await DataUnionSDK.loadDataUnionSubscriptionsBy({
      dataUnionId,
      collector
    });
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

  generateMonetizationProvider({
    chainId,
    dataUnionId
  }: {
    chainId?: ChainId;
    dataUnionId?: string;
  }): MonetizationProvider {
    return {
      protocol: DataTokenType.Profileless,
      chainId,
      dataUnionId,
      baseContract: DeployedContracts[ChainId[chainId]].DataUnion.DataUnion,
      unionContract: DeployedContracts[ChainId[chainId]].DataUnion.LitACL
    };
  }
}
