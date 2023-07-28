import { BigNumber } from "ethers";

export function formatSendTransactionData(data: any) {
  try {
    if (data) {
      data = BigNumber.from(data).toHexString().replace(/^0x0*/, "0x");
    }
  } catch (error) {
    // to do
  }
  return data;
}
