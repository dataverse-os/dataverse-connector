
# Wallet-Adaptor

## Overview

This repository is for the code adaptation work of integrating our own Dataverse Wallet into [wagmi](https://github.com/wagmi-dev/references) and [Rainbowkit](https://github.com/rainbow-me/rainbowkit) through pull requests.

- [forked wagmi](https://github.com/dataverse-os/wagmi-references)
- [forked rainbowkit](https://github.com/dataverse-os/rainbowkit)

## adapt-to-wagmi

In this package, we inherit the base class `Connector` from wagmi and define our own `DataverseConnector`. The `DataverseConnector` can be used in Rainbowkit for subsequent purposes.

## adapt-to-rainbowkit

This package contains
`dataverseWallet.ts` and `injectedDataverseWallet.ts`.

### 1.dataverseWallet.ts

`dataverseWallet` directly inherits from the `DataverseConnector` in wagmi (which has not been merged yet).

### 2.injectedDataverseWallet.ts

`dataverseWallet` inherits from the widely used `InjectedConnector` in wagmi.
