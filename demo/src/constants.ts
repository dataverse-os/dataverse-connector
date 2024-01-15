export const contractAddress1 = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
export const abi1 = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "node", type: "bytes32" },
      {
        indexed: true,
        internalType: "bytes32",
        name: "label",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "NewOwner",
    type: "event"
  }
];

export const contractAddress2 = "0x2e43c080B56c644F548610f45998399d42e3d400";
export const abi2 = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value_",
        type: "uint256"
      }
    ],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "value",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

export const ensName = "jxom.eth";

export const domain = {
  name: "Ether Mail",
  version: "1",
  chainId: 80001,
  verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
} as const;

export const types = {
  Person: [
    { name: "name", type: "string" },
    { name: "wallet", type: "address" }
  ],
  Mail: [
    { name: "from", type: "Person" },
    { name: "to", type: "Person" },
    { name: "contents", type: "string" }
  ]
} as const;

export const message = {
  from: {
    name: "Cow",
    wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
  },
  to: {
    name: "Bob",
    wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
  },
  contents: "Hello, Bob!"
} as const;
