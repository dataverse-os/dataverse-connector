import { convertTxData } from ".";
import { Contract, ethers } from "ethers";

export class ExternalWallet {
  wallet = "ExternalWallet";
  externalProvider: any;
  provider: ethers.providers.Web3Provider;
  signer: ethers.providers.JsonRpcSigner;

  setProvider(externalProvider: any) {
    this.externalProvider = externalProvider;
  }

  async connectWallet(): Promise<{
    address: string;
    namespace: string;
    reference: string;
  }> {
    const provider = new ethers.providers.Web3Provider(
      this.externalProvider,
      "any"
    );
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    const namespace = "eip155";
    const reference = String(chainId);
    this.provider = provider;
    this.signer = signer;
    return {
      address,
      namespace,
      reference
    };
  }

  async sign({
    method,
    params
  }: {
    method: string;
    params: any[];
  }): Promise<string> {
    const res = await this.signer[method as string](...params);
    return res;
  }

  async ethereumRequest({
    method,
    params
  }: {
    method: string;
    params?: Array<any>;
  }): Promise<any> {
    const res = await this.externalProvider.request({
      method,
      params
    });
    return res;
  }

  async contractCall({
    contractAddress,
    abi,
    method,
    params
  }: {
    contractAddress: string;
    abi: any[];
    method: string;
    params?: any[];
  }): Promise<any> {
    const contract = new Contract(contractAddress, abi, this.signer);
    const tx = await (params
      ? contract[method](...params)
      : contract[method]());
    if (tx && typeof tx === "object" && tx.wait) {
      let res = await tx.wait();
      res = convertTxData(res);
      return res;
    }
    return tx;
  }
}
