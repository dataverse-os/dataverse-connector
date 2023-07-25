import { DataverseWalletConnector } from "./dataverseWalletConnector";
import { Chain, Wallet } from "@rainbow-me/rainbowkit";

export interface DataverseWalletOptions {
  chains: Chain[];
}

export const dataverseWallet = ({ chains }: DataverseWalletOptions): Wallet => {
  return {
    id: "dataverse",
    name: "Dataverse Wallet",
    iconUrl: async () => (await import("./dataverseWallet.svg")).default,
    iconBackground: "#ffffff",
    downloadUrls: {
      chrome:
        "https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead",
      browserExtension: "https://dataverse-os.com",
    },
    createConnector: () => ({
      connector: new DataverseWalletConnector({
        chains,
      }),
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
    }),
  };
};
