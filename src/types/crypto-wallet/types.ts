import { ethers } from "ethers";

export type CRYPTO_WALLET_NAME =
  | "MetaMask"
  | "Temple"
  | "Coinbase"
  | "Particle"
  | "WalletConnect";
  
export type CRYPTO_WALLET_TYPE = "CRYPTO_WALLET";
export type PROVIDER =
  | ethers.providers.Web3Provider
  | ethers.providers.BaseProvider;

export type SIGNER = ethers.providers.JsonRpcSigner | ethers.Wallet;

export interface CRYPTO_WALLET {
  name: CRYPTO_WALLET_NAME;
  type: CRYPTO_WALLET_TYPE;
}
