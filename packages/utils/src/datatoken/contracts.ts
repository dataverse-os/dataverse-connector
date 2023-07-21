import { Contract, Signer, ethers } from "ethers";

export function getIsCollectedContract({
  datatokenId,
  provider,
}: {
  datatokenId: string;
  provider?: ethers.providers.JsonRpcProvider;
}): Contract {
  return new Contract(
    datatokenId,
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
        ],
        name: "isCollected",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );
}
