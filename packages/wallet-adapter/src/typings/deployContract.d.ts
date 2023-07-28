// declare module 'viem/dist/esm/actions/wallet/deployContract' {
//   function deployContract<
//     TAbi extends Abi | readonly unknown[],
//     TChain extends Chain | undefined,
//     TAccount extends Account | undefined,
//     TChainOverride extends Chain | undefined,
//   >(
//     walletClient: WalletClient<Transport, TChain, TAccount>,
//     {
//       abi,
//       args,
//       bytecode,
//       ...request
//     }: DeployContractParameters<TAbi, TChain, TAccount, TChainOverride>,
//   ): Promise<DeployContractReturnType> {
//     const calldata = encodeDeployData({
//       abi,
//       args,
//       bytecode,
//     } as unknown as DeployContractParameters<TAbi, TChain, TAccount, TChainOverride>);
//     return sendTransaction(walletClient, {
//       ...request,
//       data: calldata,
//     } as unknown as SendTransactionParameters<TChain, TAccount, TChainOverride>);
//   }
// }
