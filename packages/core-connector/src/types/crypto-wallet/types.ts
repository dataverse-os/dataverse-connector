import { ethers } from "ethers";

export type PROVIDER =
  | ethers.providers.Web3Provider
  | ethers.providers.BaseProvider;

export type SIGNER = ethers.providers.JsonRpcSigner | ethers.Wallet;

export interface Chain {
  chainId: number;
  chainName: string;
}
