import { Contract, Signer } from "ethers";
import { LENS_HUB, LENS_PROFILE_CREATION_PROXY } from "./constants";

export function getProfileCreationProxyContract(signer?: Signer): Contract {
  return new Contract(
    LENS_PROFILE_CREATION_PROXY,
    [
      {
        inputs: [
          {
            components: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "string",
                name: "handle",
                type: "string",
              },
              {
                internalType: "string",
                name: "imageURI",
                type: "string",
              },
              {
                internalType: "address",
                name: "followModule",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "followModuleInitData",
                type: "bytes",
              },
              {
                internalType: "string",
                name: "followNFTURI",
                type: "string",
              },
            ],
            internalType: "struct DataTypes.CreateProfileData",
            name: "vars",
            type: "tuple",
          },
        ],
        name: "proxyCreateProfile",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    signer,
  );
}

export function getProfileIdGetterContract(signer?: Signer): Contract {
  return new Contract(
    LENS_HUB,
    [
      {
        inputs: [
          {
            internalType: "string",
            name: "handle",
            type: "string",
          },
        ],
        name: "getProfileIdByHandle",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    signer,
  );
}
