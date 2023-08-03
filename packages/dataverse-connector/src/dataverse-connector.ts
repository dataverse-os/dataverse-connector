import { Communicator } from "@dataverse/communicator";
import { WalletProvider } from "@dataverse/wallet-provider";
import {
  RequestType,
  SYSTEM_CALL,
  ReturnType,
  Chain,
  WALLET,
  Extension,
  Provider,
} from "./types";
import {
  createLensProfile,
  getLensProfileIdByHandle,
  getLensProfiles,
  detectDataverseExtension,
  getDatatokenBaseInfo,
  isCollected,
  ExternalWallet,
} from "@dataverse/utils";
import { ethers } from "ethers";
import { getDapp, getDapps } from "@dataverse/dapp-table-client";
import { getAddress } from "viem";
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

export class DataverseConnector {
  private communicator: Communicator;
  private provider?: Provider;
  private dataverseProvider?: WalletProvider;
  private externalProvider?: any;
  private externalWallet: ExternalWallet;
  isConnected?: boolean;
  wallet?: WALLET;
  address?: string;
  chain?: Chain;
  appId?: string;
  publicKey?: string;
  symmetricKey: string;
  encryptedSymmetricKey: string;

  constructor() {
    if (!window.externalWallet) {
      window.externalWallet = new ExternalWallet();
    }
    this.externalWallet = window.externalWallet;
    if (!window.dataverseCommunicator) {
      this.communicator = new Communicator({
        source: window,
        target: window.top,
        methodClass: this.externalWallet,
      });
      window.dataverseCommunicator = this.communicator;
    } else {
      this.communicator = window.dataverseCommunicator;
    }
    this.communicator.onRequestMessage(() => {});
  }

  getProvider(): Provider {
    return this.provider;
  }

  async connectWallet(params?: {
    wallet?: WALLET | undefined;
    provider?: Provider;
  }): Promise<{
    address: string;
    chain: Chain;
    wallet: WALLET;
  }> {
    let wallet: WALLET;
    let provider: Provider;
    if (params) {
      wallet = params.wallet;
      provider = params.provider || window.dataverse;
    } else {
      provider = window.dataverse;
    }

    if (provider.isDataverse) {
      if (!(await detectDataverseExtension())) {
        throw "The plugin has not been loaded yet. Please check the plugin status or go to https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead to install plugins";
      }
      if (wallet === WALLET.EXTERNAL_WALLET) {
        throw "Conflict between wallet and provider";
      }

      this.communicator.onRequestMessage(() => {});

      const res = await window.dataverse.connectWallet(
        wallet || provider.wallet,
      );

      if (!this.isConnected) {
        this.dataverseProvider = new WalletProvider();
        this.dataverseProvider.on("chainChanged", (chainId: number) => {
          this.chain.chainId = chainId;
        });
        this.dataverseProvider.on("chainNameChanged", (chainName: string) => {
          this.chain.chainName = chainName;
        });
        this.dataverseProvider.on("accountsChanged", (accounts: string[]) => {
          this.address = accounts[0];
        });
      }

      this.isConnected = true;
      this.wallet = res.wallet;
      this.address = res.address;
      this.chain = res.chain;
      this.provider = this.dataverseProvider;

      return res;
    }
    this.externalProvider = provider;
    window.dataverseExternalProvider = provider;
    this.externalWallet.setProvider(provider);
    this.communicator.onRequestMessage(undefined);

    const res = await window.dataverse.connectWallet(WALLET.EXTERNAL_WALLET);

    this.externalProvider.removeAllListeners("chainChanged");
    this.externalProvider.removeAllListeners("accountsChanged");
    this.externalProvider.on("chainChanged", (networkId: string) => {
      const chainId = Number(networkId);
      this.chain.chainId = chainId;
      this.chain.chainName =
        chainId === 80001 ? "mumbai" : chainId === 1 ? "ethereum" : "Unknown";
    });
    this.externalProvider.on("accountsChanged", (accounts: string[]) => {
      this.address = getAddress(accounts[0]);
    });

    this.isConnected = true;
    this.wallet = res.wallet;
    this.address = res.address;
    this.chain = res.chain;
    this.provider = this.externalProvider;

    return {
      wallet: this.wallet,
      address: this.address,
      chain: this.chain,
    };
  }

  async getCurrentWallet(): Promise<
    | {
        address: string;
        chain: Chain;
        wallet: WALLET;
      }
    | undefined
  > {
    return window.dataverse.getCurrentWallet();
  }

  async runOS<T extends SYSTEM_CALL>({
    method,
    params,
  }: {
    method: T;
    params?: RequestType[T];
  }): Promise<Awaited<ReturnType[T]>> {
    if (
      method !== SYSTEM_CALL.checkCapability &&
      method !== SYSTEM_CALL.loadStream &&
      method !== SYSTEM_CALL.loadStreamsBy &&
      method !== SYSTEM_CALL.getModelBaseInfo &&
      !this?.isConnected
    ) {
      throw new Error("Please connect wallet first");
    }

    params = this.encryptParams({ method, params });

    let result = await (this.communicator.sendRequest({
      method,
      params,
      postMessageTo: Extension,
    }) as ReturnType[SYSTEM_CALL]);

    result = this.decryptResult({ method, result });

    if (method === SYSTEM_CALL.createCapability) {
      this.appId = (params as RequestType[SYSTEM_CALL.createCapability]).appId;
      // this.verifySignature(result);
      const { publicKey, pkh } = result;
      this.publicKey = publicKey;
      result = pkh
    }

    return result;
  }

  // private verifySignature(data) {
  //   const hash = CryptoJS.SHA256(JSON.stringify(data)).toString();

  //   const jsEncrypt = new JSEncrypt();
  //   const verified = jsEncrypt.verify(hash, data.signature, CryptoJS.SHA256);
  // }

  private encryptParams({ method, params }) {
    if (
      method !== SYSTEM_CALL.createCapability &&
      method !== SYSTEM_CALL.checkCapability &&
      method !== SYSTEM_CALL.loadStream &&
      method !== SYSTEM_CALL.loadStreamsBy &&
      method !== SYSTEM_CALL.getModelBaseInfo
    ) {
      if (!this.encryptedSymmetricKey) {
        const jsEncrypt = new JSEncrypt();
        jsEncrypt.setPublicKey(this.publicKey);
        this.symmetricKey = CryptoJS.enc.Hex.stringify(
          CryptoJS.lib.WordArray.random(16),
        );
        this.encryptedSymmetricKey = jsEncrypt.encrypt(
          this.symmetricKey,
        ) as string;
      }
      if (params) {
        const encryptedParams = CryptoJS.AES.encrypt(
          JSON.stringify(params),
          this.symmetricKey,
        ).toString();
        params = {
          p: encryptedParams,
          s: this.encryptedSymmetricKey,
        };
      } else {
        params = {
          s: this.encryptedSymmetricKey,
        };
      }
    }
    return params;
  }

  private decryptResult({ method, result }) {
    if (
      result &&
      method !== SYSTEM_CALL.createCapability &&
      method !== SYSTEM_CALL.checkCapability &&
      method !== SYSTEM_CALL.loadStream &&
      method !== SYSTEM_CALL.loadStreamsBy &&
      method !== SYSTEM_CALL.getModelBaseInfo &&
      method !== SYSTEM_CALL.getValidAppCaps
    ) {
      const bytes = CryptoJS.AES.decrypt(result, this.symmetricKey);
      result = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return result;
  }

  getDAppTable() {
    return getDapps();
  }

  getDAppInfo(dappId: string) {
    return getDapp(dappId);
  }

  getCurrentPkh(): string {
    if (!this.address) {
      throw new Error("Please connect wallet first");
    }
    return `did:pkh:eip155:1:${this.address}`;
  }

  async createProfile(handle: string): Promise<string> {
    const provider = new ethers.providers.Web3Provider(this.provider, "any");
    const signer = provider.getSigner();
    const id = await getLensProfileIdByHandle({ handle, signer });
    if (id != 0) throw new Error("Handle is taken, try a new handle.");
    return createLensProfile({ handle, signer });
  }

  async getProfiles(address: string): Promise<{ id: string }[]> {
    return getLensProfiles(address);
  }

  async isCollected({
    datatokenId,
    address,
  }: {
    datatokenId: string;
    address: string;
  }): Promise<boolean> {
    return isCollected({ datatokenId, address });
  }

  async getDatatokenBaseInfo(datatokenId: string): Promise<object> {
    return getDatatokenBaseInfo(datatokenId);
  }
}
