<br/>
<p align="center">
<a href=" " target="_blank">
<img src="./logo.svg" width="180" alt="Dataverse logo">
</a >
</p >
<br/>

# dataverse-connector

[![npm version](https://img.shields.io/npm/v/@dataverse/dataverse-connector.svg)](https://www.npmjs.com/package/@dataverse/dataverse-connector)
![npm](https://img.shields.io/npm/dw/@dataverse/dataverse-connector)
[![License](https://img.shields.io/npm/l/@dataverse/dataverse-connector.svg)](https://github.com/dataverse-os/dataverse-connector/blob/main/LICENSE.md)

The system calls exposed by Dataverse Kernel

## Installation

```bash
pnpm install @dataverse/dataverse-connector
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
<img src="https://s2.loli.net/2023/06/12/zeyQlmbTpUEvHdu.png" width="300" alt="Dataverse logo">
</a >
</p >
<br/>

## Usage

```typescript
import { DataverseConnector, Extension } from "@dataverse/dataverse-connector";

const dataverseConnector = new DataverseConnector(Extension);
```

## Functions

**`dataverseConnector.connectWallet(WALLET.METAMASK)`**

Connect with user wallet.
pass in which wallet you want to connect with, currently support MetaMask and Particle Network.

  ```js
  enum WALLET {
    METAMASK = "MetaMask",
    PARTICLE = "Particle"
  }
  ```
- Returns:
  - If the wallet is not connected, a pop-up will appear for the user to select a wallet address. After the user selects an address, the address will be returned to indicate that the wallet is connected.
  - If the wallet is already connected, will return wallet address and other info, example:
```json
{
    "address": "0x312eA852726E3A9f633A0377c0ea882086d66666",
    "chain": {
        "chainId": 80001,
        "chainName": "mumbai"
    },
    "wallet": "MetaMask"
}
```
<br>

**`dataverseConnector.createCapability({appId: string, resource: RESOURCE, wallet: WALLET})`**

Create a capability for the application to access the data resources.
- `appId`: `string` - which appId is requesting the capability.
- `resource`: `RESOURCE` - Resource to give access to the capability.
  ```js
  enum RESOURCE {
    CERAMIC,
  }
  ```
This method will open a popup and ask the user to sign a message to create a capability. The message will be like this.
```yaml
Message:
Give this application access to some of your data

URI:
did:key:z6MknFM4H7EFyBGANghNvV43uLvUKvRPU94fUcc8AZQZCq8Z

Version:
1

Chain ID:
1

Nonce:
UboH08SYfJn9N2

Issued At:
2023-06-12T06:35:19.225Z

Expires At:
2023-06-19T06:35:19.225Z

Resources: 4
ceramic://*?model=kjzl6hvfrbw6c763ubdhowzao0m4yp84cxzbfnlh4hdi5alqo4yrebmc0qpjdi5
ceramic://*?model=kjzl6hvfrbw6c7cp6xafsa7ghxh1yfw4bsub1363ehrxhi999vlpxny9k69uoxz
ceramic://*?model=kjzl6hvfrbw6c5qdzwi9esxvt1v5mtt7od7hb2947624mn4u0rmq1rh9anjcnxx
ceramic://*?model=kjzl6hvfrbw6c6ad7ydn0hi4vtamx2v620hdgu6llq49h28rfd6cs02g3cmn9za
```

- Returns:
  - `pkh`: `string` - a pkh did you may use to interact with the data resources later.
```js
did:pkh:eip155:137:0x29761660d6Cb26a08e9A9c7de12E0038eE9cb623
```


<br>

check all functions in [docs](https://docs.dataverse-os.com/sdk/apis).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Documentation

View [Docs](https://docs.dataverse-os.com/).

## Contributing

Contributions to this project are welcome. To contribute, please follow these steps:

1. Fork the repository and create a new branch.
2. Make your changes and test them thoroughly.
3. Submit a pull request with a detailed description of your changes.
