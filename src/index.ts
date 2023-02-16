export { RuntimeConnector } from "./runtime-connector";
export { type PostMessageTo } from "@dataverse/communicator";
export {
  Browser,
  Extension,
  METAMASK,
  CRYPTO_WALLET_TYPE,
  Apps,
  ModelNames,
  FolderType,
  FileType,
  OriginType,
  DataverseKernel,
  IndexFileContentType,
  DecryptionConditionsTypes,
  type StreamObject,
  type Mirror,
  type Mirrors,
  type MirrorFile,
  type StructuredFolder,
  type StructuredFolders,
} from "@dataverse/dataverse-kernel";

export const getDidFromAddress = (address: string) =>
  `did:pkh:eip155:${process.env.IS_MAINNET === 'false' ? '80001' : '137'}:` + address;

export const getAddressFromDid = (did: string) => did.slice(did.lastIndexOf(':') + 1);
