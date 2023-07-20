import { RequestType, SYSTEM_CALL } from "./types";
import { convertTxData } from "@dataverse/utils";
import { Contract, ethers } from "ethers";

export class MethodClass {
  provider: any;

  setProvider(provider: any) {
    this.provider = provider;
  }

  async connectWallet() {
    const provider = new ethers.providers.Web3Provider(this.provider, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    const namespace = "eip155";
    const reference = String(chainId);
    return {
      address,
      namespace,
      reference,
    };
  }

  async sign({ method, params }: { method: string; params: any[] }) {
    const provider = new ethers.providers.Web3Provider(this.provider!, "any");
    const signer = provider.getSigner();
    const res = await signer[method as string](...params);
    return res;
  }

  async ethereumRequest({
    method,
    params,
  }: RequestType[SYSTEM_CALL.ethereumRequest]) {
    const res = await this.provider.request({
      method,
      params,
    });
    return res;
  }

  async contractCall({
    contractAddress,
    abi,
    method,
    params,
  }: RequestType[SYSTEM_CALL.contractCall]) {
    const provider = new ethers.providers.Web3Provider(this.provider!, "any");
    const signer = provider.getSigner();
    const contract = new Contract(contractAddress, abi, signer);
    const tx = await contract[method](...params);
    if (tx && typeof tx === "object" && tx.wait) {
      let res = await tx.wait();
      res = convertTxData(res);
      return res;
    }
    return tx;
  }
}
