import { BigNumber, Signer } from "ethers";
import {
  getProfileCreationProxyContract,
  getProfileIdGetterContract,
} from "./contracts";
import {
  DEFAULT_FOLLOW_NFT_URI,
  DEFAULT_IMAGE_URI,
  LENS_API,
  LENS_HUB,
  ZERO_ADDRESS,
} from "./constants";
import { gql, GraphQLClient } from "graphql-request";

export async function createLensProfile(vars: {
  recipient?: string;
  handle: string;
  imageURI?: string;
  followNFTURI?: string;
  signer: Signer;
}) {
  const { signer } = vars;
  const address = await signer.getAddress();
  console.log("signer address :", address);

  const input = {
    to: vars.recipient ?? address,
    handle: vars.handle,
    imageURI: vars.imageURI ?? DEFAULT_IMAGE_URI,
    followModule: ZERO_ADDRESS,
    followModuleInitData: [],
    followNFTURI: vars.followNFTURI ?? DEFAULT_FOLLOW_NFT_URI,
  };

  console.log("Create Profile :", input);

  const profileCreationProxy = getProfileCreationProxyContract(signer);

  const estimateGas =
    await profileCreationProxy.estimateGas.proxyCreateProfile(input);

  const tx = await profileCreationProxy.proxyCreateProfile(input, {
    gasLimit: estimateGas.mul(15).div(10),
  });

  const txReceipt = await tx.wait();
  console.log({ txReceipt });

  const transferLog = txReceipt.logs.filter((log: any) => {
    return (
      log.address === LENS_HUB &&
      log.topics[0] ===
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    );
  })[0];

  const profileId = BigNumber.from(transferLog.topics[3]).toHexString();

  return profileId;
}

export async function getLensProfileIdByHandle({
  handle,
  signer,
}: {
  handle: string;
  signer: Signer;
}) {
  const profileIdGetter = getProfileIdGetterContract(signer);
  const profileId = await profileIdGetter.getProfileIdByHandle(
    `${handle}.test`,
  );
  console.log("Handle => profileId: ", profileId);
  return profileId;
}

export async function getLensProfiles(address: string) {
  const query = gql`
    query ProfileQuery($request: ProfileQueryRequest!) {
      profiles(request: $request) {
        items {
          id
        }
      }
    }
  `;
  const client = new GraphQLClient(LENS_API);
  const result: any = await client.request(query, {
    request: {
      ownedBy: address,
    },
  });
  return result.profiles.items.map((item: any) => ({
    ...item,
    id: BigNumber.from(item.id).toHexString(),
  }));
}
