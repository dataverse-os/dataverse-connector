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
import { ReturnType, Methods } from "./types/event";
import { BigNumber, BigNumberish, Signer, ethers } from "ethers";
import { Deferrable } from "ethers/lib/utils";

export class Provider extends _Provider implements ExternalProvider {
  runtimeConnector: RuntimeConnector;
  walletInfo: Omit<
    Awaited<ReturnType[Methods.connectWallet]>,
    "provider" | "signer" | "ethersProvider" | "ethersSigner"
  >;
  ethersProvider: ethers.providers.Web3Provider;

  constructor({
    runtimeConnector,
    walletInfo,
  }: {
    runtimeConnector: RuntimeConnector;
    walletInfo: Awaited<ReturnType[Methods.connectWallet]>;
  }) {
    super();
    this.runtimeConnector = runtimeConnector;
    this.walletInfo = walletInfo;
    this.ethersProvider = new ethers.providers.Web3Provider(this);
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
  getBalance(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<BigNumber> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_getBalance",
      params: [addressOrName, blockTag],
    });
  }

  getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag
  ): Promise<number> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_getTransactionCount",
      params: [addressOrName, blockTag],
    });
  }

  getCode(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_getCode",
      params: [addressOrName, blockTag],
    });
  }

  getStorageAt(
    addressOrName: string | Promise<string>,
    position: BigNumberish | Promise<BigNumberish>,
    blockTag?: BlockTag | Promise<BlockTag>
  ): Promise<string> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_getStorageAt",
      params: [addressOrName, position, blockTag],
    });
  }

  // Execution
  sendTransaction(
    transaction: string | Promise<string>
  ): Promise<TransactionResponse> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_sendTransaction",
      params: [transaction],
    });
  }

  call(
    transaction: Deferrable<TransactionRequest>,
    blockTag?: BlockTag
  ): Promise<string> {
    return this.runtimeConnector.ethereumRequest({
      method: "eth_call",
      params: [transaction, blockTag],
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

  getBlockWithTransactions(
    blockHash: BlockTag | string | Promise<BlockTag | string>
  ): Promise<BlockWithTransactions> {
    return this.ethersProvider.getBlockWithTransactions(blockHash);
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
  async resolveName(name: string): Promise<string> {
    const ethersProvider = new ethers.providers.Web3Provider(this);
    return ethersProvider.resolveName(name);
  }

  async lookupAddress(address: string): Promise<string> {
    const ethersProvider = new ethers.providers.Web3Provider(this);
    return ethersProvider.lookupAddress(address);
  }

  // Event Emitter (ish)
  on(eventName: EventType, listener: Listener): _Provider {
    const ethersProvider = new ethers.providers.Web3Provider(this);
    return ethersProvider.on(eventName, listener);
  }

  once(eventName: EventType, listener: Listener): _Provider {
    const ethersProvider = new ethers.providers.Web3Provider(this);
    return ethersProvider.once(eventName, listener);
  }

  emit(eventName: EventType, ...args: Array<any>): boolean {
    return true;
  }

  listenerCount(eventName?: EventType): number {
    return 1;
  }

  listeners(eventName?: EventType): Array<Listener> {
    return [() => {}];
  }

  off(eventName: EventType, listener?: Listener): _Provider {
    return this;
  }

  removeAllListeners(eventName?: EventType): _Provider {
    return this;
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
