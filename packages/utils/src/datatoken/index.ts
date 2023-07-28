import { gql, GraphQLClient } from "graphql-request";
import { DATATOKEN_API, RPC_FOR_DATATOKEN, TOKEN_LIST } from "./constants";
import { ethers } from "ethers";
import { getIsCollectedContract } from "./contracts";

export async function isCollected({
  datatokenId,
  address,
}: {
  datatokenId: string;
  address: string;
}): Promise<boolean> {
  const provider = new ethers.providers.JsonRpcProvider(RPC_FOR_DATATOKEN);
  const contract = getIsCollectedContract({ datatokenId, provider });
  const res = await contract.isCollected(address);
  return res;
}

export async function getDatatokenBaseInfo(datatokenId: string): Promise<any> {
  const query = gql`
    query DataToken($address: String!) {
      dataToken(address: $address) {
        address
        collect_info {
          collect_nft_address
          sold_list {
            owner
            token_id
          }
          price {
            amount
            currency
            currency_addr
          }
          sold_num
          total
          who_can_free_collect
        }
        content_uri
        owner
        source
      }
    }
  `;

  const client = new GraphQLClient(DATATOKEN_API);
  const baseInfo: any = await client.request(query, { address: datatokenId });

  if (baseInfo?.dataToken) {
    Object.entries(TOKEN_LIST).find(([key, value]) => {
      if (
        value.address === baseInfo.dataToken.collect_info.price.currency_addr
      ) {
        baseInfo.dataToken.collect_info.price.currency = key;
        return true;
      }
      return false;
    });
    return baseInfo.dataToken;
  }

  throw new Error("Datatoken not found");
}
