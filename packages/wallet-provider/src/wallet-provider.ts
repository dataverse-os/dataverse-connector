import EventEmitter from "eventemitter3";
import { ConnecterEvents } from "./types";
import { ethers, Bytes } from "ethers";
import { Deferrable } from "ethers/lib/utils";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/providers";
import { formatSendTransactionData } from "@dataverse/utils";

export class WalletProvider extends EventEmitter<ConnecterEvents> {
  ethersProvider: ethers.providers.Web3Provider;

  constructor() {
    super();
    this.ethersProvider = new ethers.providers.Web3Provider(this, "any");
    // coreConnector.communicator.onRequestMessage(
    //   this.eventListener.bind(this)
    // );
  }

  // eventListener(event: MessageEvent<EventInput & EventArguments>) {
  //   const args = event.data;
  //   if (event.data.method === "chainChanged") {
  //     if (this.wallet === args.params.wallet) {
  //       this.emit(args.method, args.params.chain.chainId);
  //       this.chain = args.params;
  //     }
  //   } else if (event.data.method === "accountsChanged") {
  //     this.emit(args.method, args.params);
  //     this.address = args.params[0];
  //   } else {
  //     this.emit(args.method, args.params);
  //   }
  // }

  // // Network
  // getNetwork(): Promise<Network> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_chainId",
  //     params: [],
  //   });
  // }

  // // Latest State
  // getBlockNumber(): Promise<number> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_blockNumber",
  //     params: [],
  //   });
  // }

  // getGasPrice(): Promise<BigNumber> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_gasPrice",
  //     params: [],
  //   });
  // }

  // getChainId(): Promise<number> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_chainId",
  //     params: [],
  //   });
  // }

  // // Account
  // async getBalance(
  //   addressOrName: string | Promise<string>,
  //   blockTag?: BlockTag | Promise<BlockTag>
  // ): Promise<BigNumber> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_getBalance",
  //     params: [await addressOrName, await blockTag],
  //   });
  // }

  // async getTransactionCount(
  //   addressOrName: string | Promise<string>,
  //   blockTag?: BlockTag | Promise<BlockTag>
  // ): Promise<number> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_getTransactionCount",
  //     params: [await addressOrName, await blockTag],
  //   });
  // }

  // async getCode(
  //   addressOrName: string | Promise<string>,
  //   blockTag?: BlockTag | Promise<BlockTag>
  // ): Promise<string> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_getCode",
  //     params: [await addressOrName, await blockTag],
  //   });
  // }

  // async getStorageAt(
  //   addressOrName: string | Promise<string>,
  //   position: BigNumberish | Promise<BigNumberish>,
  //   blockTag?: BlockTag | Promise<BlockTag>
  // ): Promise<string> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_getStorageAt",
  //     params: [await addressOrName, await position, await blockTag],
  //   });
  // }

  // // Execution
  // async getAddress(): Promise<string> {
  //   const res = await this.coreConnector.ethereumRequest({
  //     method: "eth_accounts",
  //   });
  //   return res[0];
  // }

  // signMessage(message: Bytes | string): Promise<string> {
  //   return this.coreConnector.sign({
  //     method: SignMethod.signMessage,
  //     params: [message],
  //   });
  // }

  // _signTypedData(
  //   domain: TypedDataDomain,
  //   types: Record<string, Array<TypedDataField>>,
  //   message: Record<string, Array<TypedDataField> | string>
  // ): Promise<string> {
  //   return this.coreConnector.sign({
  //     method: SignMethod._signTypedData,
  //     params: [domain, types, message],
  //   });
  // }

  // signTransaction(): Promise<string> {
  //   throw new Error("'signTransaction' is unsupported !");
  // }

  // async sendTransaction(
  //   transaction: Deferrable<TransactionRequest> | (string | Promise<string>)
  // ): Promise<TransactionResponse> {
  //   if (transaction && typeof transaction === "object") {
  //     transaction = transaction as TransactionRequest;
  //     if (!transaction?.from) {
  //       transaction.from = this.address;
  //     }
  //     Object.entries(transaction).forEach(([key, value]) => {
  //       if (formatSendTransactionData(value)) {
  //         transaction[key] = formatSendTransactionData(value);
  //       } else {
  //         delete transaction[key];
  //       }
  //     });
  //     const signer = this.ethersProvider.getSigner();
  //     return signer.sendTransaction(transaction);
  //   } else {
  //     return this.coreConnector.ethereumRequest({
  //       method: "eth_sendTransaction",
  //       params: [transaction],
  //     });
  //   }
  // }

  // async call(
  //   transaction: Deferrable<TransactionRequest>,
  //   blockTag?: BlockTag | Promise<BlockTag>
  // ): Promise<string> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_call",
  //     params: [transaction, await blockTag],
  //   });
  // }

  // estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_estimateGas",
  //     params: [transaction],
  //   });
  // }

  // // Queries
  // getBlock(blockHash: string): Promise<Block> {
  //   return this.ethersProvider.getBlock(blockHash);
  // }

  // async getBlockWithTransactions(
  //   blockHash: BlockTag | string | Promise<BlockTag | string>
  // ): Promise<BlockWithTransactions> {
  //   return this.ethersProvider.getBlockWithTransactions(await blockHash);
  // }

  // getTransaction(transactionHash: string): Promise<TransactionResponse> {
  //   return this.ethersProvider.getTransaction(transactionHash);
  // }

  // getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_getTransactionReceipt",
  //     params: [transactionHash],
  //   });
  // }

  // // Bloom-filter Queries
  // getLogs(filter: Filter): Promise<Array<Log>> {
  //   return this.coreConnector.ethereumRequest({
  //     method: "eth_getLogs",
  //     params: [filter],
  //   });
  // }

  // // ENS
  // resolveName(name: string): Promise<string> {
  //   return this.ethersProvider.resolveName(name);
  // }

  // lookupAddress(address: string): Promise<string> {
  //   return this.ethersProvider.lookupAddress(address);
  // }

  // waitForTransaction(transactionHash: string): Promise<TransactionReceipt> {
  //   return this.ethersProvider.waitForTransaction(transactionHash);
  // }

  // sendAsync(
  //   { method, params }: { method: string; params?: Array<any> },
  //   callback: Function
  // ) {
  //   this.coreConnector
  //     .ethereumRequest({ method, params })
  //     .then((res) => {
  //       callback(res);
  //     })
  //     .catch((err) => {
  //       callback(err);
  //     });
  // }

  // send(
  //   { method, params }: { method: string; params?: Array<any> },
  //   callback: Function
  // ) {
  //   this.coreConnector
  //     .ethereumRequest({ method, params })
  //     .then((res) => {
  //       callback(res);
  //     })
  //     .catch((err) => {
  //       callback(err);
  //     });
  // }

  signMessage(message: Bytes | string): Promise<string> {
    return window.dataverse.sign({
      method: "signMessage",
      params: [message],
    });
  }

  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    message: Record<string, Array<TypedDataField> | string>
  ): Promise<string> {
    return window.dataverse.sign({
      method: "_signTypedData",
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
        const res = await window.dataverse.request({
          method: "eth_accounts",
          params: [],
        });
        transaction.from = res[0];
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
      return window.dataverse.request({
        method: "eth_sendTransaction",
        params: [transaction],
      });
    }
  }

  on(event: string, listener: Function) {
    window.dataverse.on(event, listener);
    return this;
  }

  request({ method, params }: { method: string; params?: Array<any> }) {
    return window.dataverse.request({ method, params });
  }
}
