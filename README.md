<br/>
<p align="center">
<a href=" " target="_blank">
<img src="./logo.svg" width="180" alt="Dataverse logo">
</a >
</p >
<br/>

# runtime-connector

[![npm version](https://img.shields.io/npm/v/@dataverse/runtime-connector.svg)](https://www.npmjs.com/package/@dataverse/runtime-connector)
![npm](https://img.shields.io/npm/dw/@dataverse/runtime-connector)
[![License](https://img.shields.io/npm/l/@dataverse/runtime-connector.svg)](https://github.com/dataverse-os/runtime-connector/blob/main/LICENSE.md)

The system calls exposed by Dataverse Kernel

## Installation

```bash
pnpm install @dataverse/runtime-connector
```

## Run demo
### requirements
- [Data Wallet](https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead) - A secure data wallet to protect your identity and data assets.
- [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) - A cryptocurrency wallet browser extension.
- [Node.js](https://nodejs.org/en/) version >= 16.
- [pnpm](https://pnpm.io/) version >= 7.

```typescript
pnpm install // install dependencies
pnpm build  // build the package
cd demo
pnpm dev  // run the demo
```

the demo will be running on http://localhost:5173/.

<br/>
<p align="center">
<a href=" " target="_blank">
<img src="https://i.imgur.com/U069RGb.png" width="300" alt="Dataverse logo">
</a >
</p >
<br/>

## Usage

```typescript
import { RuntimeConnector, Extension } from "@dataverse/runtime-connector";

const runtimeConnector = new RuntimeConnector(Extension);
```

## Functions

**`runtimeConnector.connectWallet({ name: METAMASK, type: CRYPTO_WALLET_TYPE })`**

- `name`: Currently, only METAMASK is supported as the name attribute.
- `type`: The type attribute is of type CRYPTO_WALLET_TYPE.

- Returns:
  - If the wallet is not connected, a pop-up will appear for the user to select a wallet address. After the user selects an address, the address will be returned to indicate that the wallet is connected.
  - If the wallet is already connected, the wallet address will be returned directly.

<br>

**`runtimeConnector.createCapability({ wallet: { name: METAMASK, type: CRYPTO_WALLET_TYPE }, appName: Apps.Dataverse, })`**

- `wallet`: `CRYPTO_WALLET` object consisting of `name` and `type` properties, where `name` currently supports only the `MetaMask` string (a popular cryptocurrency wallet browser extension), while `type` is the string `CRYPTO_WALLET`.
- `appName`: `string` representing the name of the application.
- `modelNames`: The parameter `modelNames` is an optional array of model names. If provided, when the authorization pop-up is shown, the user will be asked to grant the application access to the specified model's stream ID(s) (including the stream IDs of `indexFolder`, `contentFolder`, and `indexFile`). If `modelNames` is not provided, the user will be asked to grant access to the stream IDs of all models under the application.

- Returns:
  - If the identity is not connected
    - If the wallet is not connected, a popup window will appear for the user to select a wallet address. Once the user selects an address, the wallet is connected, and the subsequent steps are the same as below.
    - If the wallet is already connected, a signature popup window will appear, and the user needs to authorize the application to write to the data model. After the user signs, the user's identity identifier, or Pkh, will be returned, indicating a successful connection to the identity.
  - If the identity is already connected, the function will return the Pkh directly, indicating a successful connection to the identity.

check all functions in [docs](https://gitbook.dataverse-os.com/api-documentation).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Documentation

View [Gitbook](https://gitbook.dataverse-os.com/).

## Contributing

Contributions to this project are welcome. To contribute, please follow these steps:

1. Fork the repository and create a new branch.
2. Make your changes and test them thoroughly.
3. Submit a pull request with a detailed description of your changes.
