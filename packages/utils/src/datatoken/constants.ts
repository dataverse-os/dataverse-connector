import { IS_MAINNET } from "../lens-profile/constants";

export const TOKEN_LIST_MUMBAI = {
  USDC: {
    chainId: 80001,
    address: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "ipfs://QmXfzKRvjZz3u5JRgC4v5mGVbm9ahrUiB4DgzHBsnWbTMM",
  },
  DAI: {
    chainId: 80001,
    address: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
  },
  WETH: {
    chainId: 80001,
    address: "0x3C68CE8504087f89c640D02d133646d98e64ddd9",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoURI: "https://polygonscan.com/token/images/wETH_32.png",
  },
  WMATIC: {
    chainId: 80001,
    address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    symbol: "WMATIC",
    name: "Wrapped Matic",
    decimals: 18,
    logoURI: "https://polygonscan.com/token/images/wMatic_32.png",
  },
};

const TOKEN_LIST_POLYGON = {
  USDC: {
    chainId: 137,
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "ipfs://QmXfzKRvjZz3u5JRgC4v5mGVbm9ahrUiB4DgzHBsnWbTMM",
  },
  DAI: {
    chainId: 137,
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
  },
  WETH: {
    chainId: 137,
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoURI: "https://polygonscan.com/token/images/wETH_32.png",
  },
  WMATIC: {
    chainId: 137,
    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    symbol: "WMATIC",
    name: "Wrapped Matic",
    decimals: 18,
    logoURI: "https://polygonscan.com/token/images/wMatic_32.png",
  },
};

export const TOKEN_LIST = IS_MAINNET ? TOKEN_LIST_POLYGON : TOKEN_LIST_MUMBAI;
export const DATAVERSE_ENDPOINT = "https://gateway.dataverse.art/v1";
export const DATATOKEN_API = `${DATAVERSE_ENDPOINT}/data-token/graphql`;
export const RPC_FOR_DATATOKEN = IS_MAINNET
  ? "https://polygon-rpc.com"
  : "https://rpc-mumbai.maticvigil.com";
