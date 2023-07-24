import { Chain, Wallet } from "@rainbow-me/rainbowkit";
import {
  ConnectorNotFoundError,
  WindowProvider,
  type InjectedConnectorOptions,
  Address,
} from "@wagmi/core";
import { InjectedConnector } from "wagmi/connectors/injected";

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
    const _provider = provider as WindowProvider & {
      connectWallet: (connectWallet?: string) => Promise<{
        address: Address;
        chain: { chainId: number; chainName: string };
        wallet: string;
      }>;
    };
    if (this.storage?.getItem("DataverseConnector_isConnected")) {
      const res = await _provider.connectWallet(
        this.storage?.getItem("DataverseConnector_wallet"),
      );
      if (provider?.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

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
    this.storage?.setItem("DataverseConnector_wallet", res.wallet);
    this.storage?.setItem("DataverseConnector_isConnected", "true");

    if (provider?.on) {
      provider.on("accountsChanged", this.onAccountsChanged);
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }

    return {
      account: res.address,
      chain: {
        id: res.chain.chainId,
        unsupported: this.isChainUnsupported(res.chain.chainId),
      },
    };
  }

  async getChainId() {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    if (this.storage?.getItem("DataverseConnector_isConnected")) {
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
    const provider = await this.getProvider();
    if (!provider?._state?.isConnected) {
      this.storage?.setItem("DataverseConnector_isConnected", false);
      return false;
    }
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
    browserExtension: "https://dataverse-os.com/",
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
          learnMoreUrl: "https://dataverse-os.com/",
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
