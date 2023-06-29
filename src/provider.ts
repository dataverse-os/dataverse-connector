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
} from "@ethersproject/providers";
import {
  BlockWithTransactions,
  Filter,
  Log,
} from "@ethersproject/abstract-provider";

import { RuntimeConnector } from "./runtime-connector";
import { BigNumber, BigNumberish, Signer, ethers } from "ethers";
import { Deferrable } from "ethers/lib/utils";

export class Provider extends _Provider implements ExternalProvider {
  runtimeConnector: RuntimeConnector;
  ethersProvider: ethers.providers.Web3Provider;

  constructor(runtimeConnector: RuntimeConnector) {
    super();
    this.runtimeConnector = runtimeConnector;
    this.ethersProvider = new ethers.providers.Web3Provider(this, "any");
  }

  // Network
  getNetwork(): Promise<Network> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_chainId",
      params: [],
    });
  }

  // Latest State
  getBlockNumber(): Promise<number> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_blockNumber",
      params: [],
    });
  }

  getGasPrice(): Promise<BigNumber> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_gasPrice",
      params: [],
    });
  }

  getChainId(): Promise<number> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_chainId",
      params: [],
    });
  }

  // Account
  async getBalance(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<BigNumber> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_getBalance",
      params: [await addressOrName, await blockTag],
    });
  }

  async getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<number> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_getTransactionCount",
      params: [await addressOrName, await blockTag],
    });
  }

  async getCode(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_getCode",
      params: [await addressOrName, await blockTag],
    });
  }

  async getStorageAt(
    addressOrName: string | Promise<string>,
    position: BigNumberish | Promise<BigNumberish>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_getStorageAt",
      params: [await addressOrName, await position, await blockTag],
    });
  }

  // Execution
  async sendTransaction(
    transaction: string | Promise<string>
  ): Promise<TransactionResponse> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_sendTransaction",
      params: [await transaction],
    });
  }

  async call(
    transaction: Deferrable<TransactionRequest>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_call",
      params: [transaction, await blockTag],
    });
  }

  estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber> {
    return this.runtimeConnector.ethereumRequest({
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
    return this.runtimeConnector.ethereumRequest({
      method: "eth_getTransactionReceipt",
      params: [transactionHash],
    });
  }

  // Bloom-filter Queries
  getLogs(filter: Filter): Promise<Array<Log>> {
    return this.runtimeConnector.ethereumRequest({
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

  // Event Emitter (ish)
  on(eventName: EventType, listener: Listener): _Provider {
    throw new Error("Not yet implemented");
  }

  once(eventName: EventType, listener: Listener): _Provider {
    throw new Error("Not yet implemented");
  }

  emit(eventName: EventType, ...args: Array<any>): boolean {
    throw new Error("Not yet implemented");
  }

  listenerCount(eventName?: EventType): number {
    throw new Error("Not yet implemented");
  }

  listeners(eventName?: EventType): Array<Listener> {
    throw new Error("Not yet implemented");
  }

  off(eventName: EventType, listener?: Listener): _Provider {
    throw new Error("Not yet implemented");
  }

  removeAllListeners(eventName?: EventType): _Provider {
    throw new Error("Not yet implemented");
  }

  waitForTransaction(transactionHash: string): Promise<TransactionReceipt> {
    return this.ethersProvider.waitForTransaction(transactionHash);
  }

  sendAsync(
    { method, params }: { method: string; params?: Array<any> },
    callback: Function
  ) {
    this.runtimeConnector
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
    this.runtimeConnector
      .ethereumRequest({ method, params })
      .then((res) => {
        callback(res);
      })
      .catch((err) => {
        callback(err);
      });
  }

  request({ method, params }: { method: string; params?: Array<any> }) {
    return this.runtimeConnector.ethereumRequest({ method, params });
  }
}
