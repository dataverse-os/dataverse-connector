import lighthouse from "@lighthouse-web3/sdk";
import { Web3Storage } from "web3.storage";
import { NFTStorage } from "nft.storage";
export async function uploadToIPFS(
  metadata: Record<string, any>,
  name: string
) {
  try {
    if (!process.env["LIGHTHOUSE_API_KEY"]) {
      throw "Lighthouse API key not provided";
    }
    const file = new File([JSON.stringify(metadata)], name, {
      type: "text/plain"
    });
    const uploadResponse = await lighthouse.upload(
      [file],
      process.env["LIGHTHOUSE_API_KEY"]
    );
    const cid = uploadResponse.data.Hash;
    return `ipfs://${cid}`;
  } catch (error) {
    try {
      if (!process.env["WEB3STORAGE_API_KEY"]) {
        throw "Web3Storage token not provided";
      }
      const storage = new Web3Storage({
        token: process.env["WEB3STORAGE_API_KEY"]
      });
      const file = new File([JSON.stringify(metadata)], name, {
        type: "application/json"
      });
      const cid = await storage.put([file], { wrapWithDirectory: false });
      return `ipfs://${cid}`;
    } catch (error) {
      console.log("Failed to upload metadata using Web3Storage");
      console.log(error);
      if (!process.env["NFTSTORAGE_API_KEY"]) {
        throw "nft.storage token not provided";
      }
      try {
        const data = new Blob([JSON.stringify(metadata)], {
          type: "application/json"
        });
        const client = new NFTStorage({
          token: process.env["NFTSTORAGE_API_KEY"]
        });
        const cid = await client.storeBlob(data);
        return `ipfs://${cid}`;
      } catch (error) {
        console.log("Failed to upload metadata using NFTStorage");
        console.log(error);
        throw "Failed to upload metadata";
      }
    }
  }
}
