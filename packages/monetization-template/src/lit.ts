import { LIT_CHAINS } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";

export class Lit {
  litNodeClient: LitNodeClient;
  initializing: boolean;

  async initLit(): Promise<any> {
    if (this.litNodeClient) {
      return this.litNodeClient;
    }
    if (this.initializing) {
      return new Promise((resolve) => {
        setInterval(() => {
          if (this.litNodeClient) {
            resolve(this.litNodeClient);
          }
        }, 100);
      });
    }
    this.initializing = true;

    const litNodeClient = new globalThis.LitNodeClient({
      alertWhenUnauthorized: false,
      debug: false
    });

    await this.retry(async () => {
      await litNodeClient.connect();
    });

    this.litNodeClient = litNodeClient;
    this.initializing = false;
    return litNodeClient;
  }

  async retry(
    task: (...args: any[]) => Promise<any>,
    delay = 0,
    failCount = 0
  ) {
    try {
      return await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const res = await task();
            resolve(res);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    } catch (error) {
      failCount++;
      delay = 500 * 2 ** failCount;
      await this.retry(task, delay, failCount);
    }
  }

  generateIsDatatokenCollectedAccessControlConditions({
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

  generateIsDataUnionSubscribedAccessControlConditions({
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

  generateTimeStampAccessControlConditions(value: string) {
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

  async getChainNameFromChainId(chainId: number): Promise<string> {
    await this.initLit();
    return this.litChainIdToChainName(chainId);
  }

  litChainIdToChainName(chainId: number): string {
    for (let i = 0; i < Object.keys(LIT_CHAINS).length; i++) {
      const chainName = Object.keys(LIT_CHAINS)[i];
      const litChainId = LIT_CHAINS[chainName].chainId;
      if (litChainId === chainId) {
        return chainName;
      }
    }
    if (chainId === 314) {
      return "filecoin";
    }
    throw new Error(`cannot parse chainId ${chainId} for lit protocol`);
  }
}
