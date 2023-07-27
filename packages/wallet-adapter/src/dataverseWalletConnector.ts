import { Connector, Chain, Address, WalletClient } from "wagmi";
import { WalletProvider } from "@dataverse/wallet-provider";

import { createWalletClient, custom, getAddress, numberToHex } from "viem";
import { ConnectorNotFoundError, normalizeChainId } from "@wagmi/connectors";

export class DataverseWalletConnector extends Connector {
  readonly id = "Dataverse";
  readonly name = "Dataverse";
  readonly ready = true;

  #provider?: WalletProvider;

  constructor({ chains }: { chains?: Chain[] }) {
    super({
      chains,
      options: {},
    });
  }

  async getProvider() {
    if (!this.#provider) {
      this.#provider = new WalletProvider();
      return this.#provider;
    }
    return this.#provider;
  }

  async connect() {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();

    const currentWallet = await provider.getCurrentWallet();
    if (currentWallet) {
      const res = await provider.connectWallet(currentWallet.wallet);
      this.storage?.setItem("DataverseConnector_isConnected", true);

      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);

      return {
        account: res.address as Address,
        chain: {
          id: res.chain.chainId,
          unsupported: this.isChainUnsupported(res.chain.chainId),
        },
      };
    }

    this.emit("message", { type: "connecting" });
    const res = await provider.connectWallet();
    this.storage?.setItem("DataverseConnector_isConnected", true);

    provider.on("accountsChanged", this.onAccountsChanged);
    provider.on("chainChanged", this.onChainChanged);

    return {
      account: res.address as Address,
      chain: {
        id: res.chain.chainId,
        unsupported: this.isChainUnsupported(res.chain.chainId),
      },
    };
  }

  async disconnect(): Promise<void> {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    this.storage?.setItem("DataverseConnector_isConnected", false);
    this.emit("disconnect");
    provider.off("accountsChanged", this.onAccountsChanged);
    provider.off("chainChanged", this.onChainChanged);
  }

  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    const id = numberToHex(chainId);
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: id }],
    });
    return (
      this.chains.find(x => x.id === chainId) ?? {
        id: chainId,
        name: `Chain ${id}`,
        network: `${id}`,
        nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
        rpcUrls: { default: { http: [""] }, public: { http: [""] } },
      }
    );
  }

  async getWalletClient({
    chainId,
  }: { chainId?: number } = {}): Promise<WalletClient> {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ]);
    const chain = this.chains.find(x => x.id === chainId);
    if (!provider) throw new ConnectorNotFoundError();
    return createWalletClient({
      account,
      chain,
      transport: custom(provider),
    });
  }

  async getAccount(): Promise<Address> {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    const accounts = await provider.request({
      method: "eth_accounts",
    });
    // return checksum address
    return getAddress(accounts[0] as string);
  }

  async getChainId(): Promise<number> {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    return provider.request({ method: "eth_chainId" }).then(normalizeChainId);
  }

  async isAuthorized(): Promise<boolean> {
    const provider = await this.getProvider();
    if (!provider) return false;

    const currentWallet = await provider.getCurrentWallet();
    return (
      currentWallet && !!this.storage?.getItem("DataverseConnector_isConnected")
    );
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit("disconnect");
    else this.emit("change", { account: getAddress(accounts[0] as string) });
  };

  protected onChainChanged = (chainId: number) => {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = () => {
    this.emit("disconnect");
  };
}
