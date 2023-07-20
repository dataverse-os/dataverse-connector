import {
  BlockTag,
  Provider as _Provider,
  TransactionRequest,
  TransactionResponse,
  EventType,
  Listener,
  ExternalProvider,
  TransactionReceipt,
  Network,
  Block,
  BaseProvider,
} from "@ethersproject/providers";
import {
  BlockWithTransactions,
  Filter,
  Log,
} from "@ethersproject/abstract-provider";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { DataverseConnector } from "./packages/dataverse-connector/src/dataverse-connector";
import { BigNumber, BigNumberish, Signer, ethers } from "ethers";
import { Bytes, Deferrable } from "ethers/lib/utils";
import { EventArguments, EventInput, SignMethod, Chain, WALLET } from "./packages/dataverse-connector/src/types";
import { formatSendTransactionData } from "./packages/dataverse-connector/src/utils";

export class Provider extends BaseProvider implements ExternalProvider {
  dataverseConnector: DataverseConnector;
  ethersProvider: ethers.providers.Web3Provider;
  isConnected?: boolean;
  wallet?: WALLET;
  address?: string;
  chain?: Chain;
  appId?: string;

  constructor(dataverseConnector: DataverseConnector) {
    super("any");
    this.dataverseConnector = dataverseConnector;
    this.ethersProvider = new ethers.providers.Web3Provider(this, "any");
    dataverseConnector.communicator.onRequestMessage(
      this.eventListener.bind(this)
    );
  }

  eventListener(event: MessageEvent<EventInput & EventArguments>) {
    const args = event.data;
    if (event.data.method === "chainChanged") {
      if (this.wallet === args.params.wallet) {
        this.emit(args.method, args.params.chain.chainId);
        this.chain = args.params;
      }
    } else if (event.data.method === "accountsChanged") {
      this.emit(args.method, args.params);
      this.address = args.params[0];
    } else {
      this.emit(args.method, args.params);
    }
  }

  // Network
  getNetwork(): Promise<Network> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_chainId",
      params: [],
    });
  }

  // Latest State
  getBlockNumber(): Promise<number> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_blockNumber",
      params: [],
    });
  }

  getGasPrice(): Promise<BigNumber> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_gasPrice",
      params: [],
    });
  }

  getChainId(): Promise<number> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_chainId",
      params: [],
    });
  }

  // Account
  async getBalance(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<BigNumber> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_getBalance",
      params: [await addressOrName, await blockTag],
    });
  }

  async getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<number> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_getTransactionCount",
      params: [await addressOrName, await blockTag],
    });
  }

  async getCode(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_getCode",
      params: [await addressOrName, await blockTag],
    });
  }

  async getStorageAt(
    addressOrName: string | Promise<string>,
    position: BigNumberish | Promise<BigNumberish>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_getStorageAt",
      params: [await addressOrName, await position, await blockTag],
    });
  }

  // Execution
  async getAddress(): Promise<string> {
    const res = await this.dataverseConnector.ethereumRequest({
      method: "eth_accounts",
    });
    return res[0];
  }

  signMessage(message: Bytes | string): Promise<string> {
    return this.dataverseConnector.sign({
      method: SignMethod.signMessage,
      params: [message],
    });
  }

  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, Array<TypedDataField> | string>
  ): Promise<string> {
    return this.dataverseConnector.sign({
      method: SignMethod._signTypedData,
      params: [domain, types, message],
    });
  }

  signTransaction(): Promise<string> {
    throw new Error("'signTransaction' is unsupported !");
  }

  async sendTransaction(
    transaction: Deferrable<TransactionRequest> | (string | Promise<string>)
  ): Promise<TransactionResponse> {
    if (transaction && typeof transaction === "object") {
      transaction = transaction as TransactionRequest;
      if (!transaction?.from) {
        transaction.from = this.address;
      }
      Object.entries(transaction).forEach(([key, value]) => {
        if (formatSendTransactionData(value)) {
          transaction[key] = formatSendTransactionData(value);
        } else {
          delete transaction[key];
        }
      });
      const signer = this.ethersProvider.getSigner();
      return signer.sendTransaction(transaction);
    } else {
      return this.dataverseConnector.ethereumRequest({
        method: "eth_sendTransaction",
        params: [transaction],
      });
    }
  }

  async call(
    transaction: Deferrable<TransactionRequest>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_call",
      params: [transaction, await blockTag],
    });
  }

  estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_estimateGas",
      params: [transaction],
    });
  }

  // Queries
  getBlock(blockHash: string): Promise<Block> {
    return this.ethersProvider.getBlock(blockHash);
  }

  async getBlockWithTransactions(
    blockHash: BlockTag | string | Promise<BlockTag | string>
  ): Promise<BlockWithTransactions> {
    return this.ethersProvider.getBlockWithTransactions(await blockHash);
  }

  getTransaction(transactionHash: string): Promise<TransactionResponse> {
    return this.ethersProvider.getTransaction(transactionHash);
  }

  getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_getTransactionReceipt",
      params: [transactionHash],
    });
  }

  // Bloom-filter Queries
  getLogs(filter: Filter): Promise<Array<Log>> {
    return this.dataverseConnector.ethereumRequest({
      method: "eth_getLogs",
      params: [filter],
    });
  }

  // ENS
  resolveName(name: string): Promise<string> {
    return this.ethersProvider.resolveName(name);
  }

  lookupAddress(address: string): Promise<string> {
    return this.ethersProvider.lookupAddress(address);
  }

  waitForTransaction(transactionHash: string): Promise<TransactionReceipt> {
    return this.ethersProvider.waitForTransaction(transactionHash);
  }

  sendAsync(
    { method, params }: { method: string; params?: Array<any> },
    callback: Function
  ) {
    this.dataverseConnector
      .ethereumRequest({ method, params })
      .then((res) => {
        callback(res);
      })
      .catch((err) => {
        callback(err);
      });
  }

  send(
    { method, params }: { method: string; params?: Array<any> },
    callback: Function
  ) {
    this.dataverseConnector
      .ethereumRequest({ method, params })
      .then((res) => {
        callback(res);
      })
      .catch((err) => {
        callback(err);
      });
  }

  request({ method, params }: { method: string; params?: Array<any> }) {
    return this.dataverseConnector.ethereumRequest({ method, params });
  }
}
