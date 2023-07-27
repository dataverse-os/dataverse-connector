import { Chain, Wallet } from "@rainbow-me/rainbowkit";
import {
  WindowProvider,
  Address,
  ConnectorNotFoundError,
  type InjectedConnectorOptions,
} from "@wagmi/core";
import { InjectedConnector } from "wagmi/connectors/injected";
import { numberToHex } from "viem";

export interface DataverseWalletOptions {
  chains: Chain[];
}

declare global {
  interface Window {
    dataverse: any;
  }
}

class DataverseInjectedConnector extends InjectedConnector {
  constructor({
    chains,
    options,
  }: {
    chains?: Chain[];
    options?: InjectedConnectorOptions;
  }) {
    super({
      chains,
      options,
    });
  }

  async connect() {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    const _provider = provider as WindowProvider & {
      connectWallet: (connectWallet?: string) => Promise<{
        address: Address;
        chain: { chainId: number; chainName: string };
        wallet: string;
      }>;
      getCurrentWallet: () => Promise<{
        address: Address;
        chain: { chainId: number; chainName: string };
        wallet: string;
      }>;
    };

    const currentWallet = await _provider.getCurrentWallet();
    if (currentWallet) {
      const res = await _provider.connectWallet(currentWallet.wallet);
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);

      return {
        account: res.address,
        chain: {
          id: res.chain.chainId,
          unsupported: this.isChainUnsupported(res.chain.chainId),
        },
      };
    }
    this.emit("message", { type: "connecting" });
    const res = await _provider?.connectWallet();
    this.storage?.setItem("DataverseConnector_isConnected", "true");

    provider.on("accountsChanged", this.onAccountsChanged);
    provider.on("chainChanged", this.onChainChanged);

    return {
      account: res.address,
      chain: {
        id: res.chain.chainId,
        unsupported: this.isChainUnsupported(res.chain.chainId),
      },
    };
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

  async getChainId() {
    if (this.storage?.getItem("DataverseConnector_isConnected")) {
      const provider = await this.getProvider();
      if (!provider) throw new ConnectorNotFoundError();
      return provider
        .request({ method: "eth_chainId" })
        .then(function normalizeChainId(chainId) {
          if (typeof chainId === "string")
            return Number.parseInt(
              chainId,
              chainId.trim().substring(0, 2) === "0x" ? 16 : 10,
            );
          if (typeof chainId === "bigint") return Number(chainId);
          return chainId;
        });
    } else {
      return 1;
    }
  }

  async isAuthorized(): Promise<boolean> {
    return !!this.storage?.getItem("DataverseConnector_isConnected");
  }

  async disconnect(): Promise<void> {
    this.storage?.setItem("DataverseConnector_isConnected", false);
    this.emit("disconnect");
  }
}

export const dataverseWallet = ({
  chains,
  ...options
}: DataverseWalletOptions & InjectedConnectorOptions): Wallet => ({
  id: "dataverse",
  name: "Dataverse Wallet",
  iconUrl: async () => (await import("./dataverseWallet.svg")).default,
  iconBackground: "#ffffff",
  downloadUrls: {
    chrome:
      "https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead",
    browserExtension: "https://dataverse-os.com",
  },
  installed:
    typeof window !== "undefined" &&
    typeof window.dataverse !== "undefined" &&
    window["dataverse"]
      ? true
      : undefined,
  createConnector: () => {
    const injectedConnector = new DataverseInjectedConnector({
      chains,
      options: {
        getProvider: () => {
          const getDataverse = (dataverse?: any) =>
            dataverse?.isDataverse ? dataverse : undefined;
          if (typeof window === "undefined") return;
          return getDataverse(window.dataverse);
        },
        ...options,
      },
    });
    return {
      connector: injectedConnector,
      extension: {
        instructions: {
          learnMoreUrl: "https://dataverse-os.com",
          steps: [
            {
              description:
                "We recommend pinning Dataverse to your taskbar for quicker access to your wallet.",
              step: "install",
              title: "Install the Dataverse extension",
            },
            {
              description:
                "Once you set up your wallet, click below to refresh the browser and load up the extension.",
              step: "refresh",
              title: "Refresh your browser",
            },
          ],
        },
      },
    };
  },
});
