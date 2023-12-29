import { LIT_CHAINS } from "@lit-protocol/constants";
import { Contract, Signer } from "ethers";

export function getChainNameFromChainId(chainId: number): string {
  for (let i = 0; i < Object.keys(LIT_CHAINS).length; i++) {
    const chainName = Object.keys(LIT_CHAINS)[i];
    const litChainId = LIT_CHAINS[chainName].chainId;
    if (litChainId === chainId) {
      return chainName;
    }
  }
  if (chainId === 314) {
    return "filecoin";
  }
  throw new Error(`cannot parse chainId ${chainId} for lit protocol`);
}

export async function contractCall({
  contractAddress,
  abi,
  method,
  params,
  signer
}: {
  contractAddress: string;
  abi: any[];
  method: string;
  params: any[];
  signer: Signer;
}): Promise<any> {
  const contract = new Contract(contractAddress, abi, signer);
  const tx = await contract[method](...params);

  if (tx && typeof tx === "object" && tx.wait) {
    const res = await tx.wait();
    return res;
  }
  return tx;
}
