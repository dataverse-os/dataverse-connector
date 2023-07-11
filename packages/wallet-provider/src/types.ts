export interface ConnecterEvents {
  chainChanged(chain: { chainId: number; chainName: string }): void;
  accountsChanged(accounts: string[]): void;
}
