import { BigNumber } from "ethers";

export function formatSendTransactionData(data: any) {
  try {
    if (data) {
      data = BigNumber.from(data).toHexString().replace(/^0x0*/, "0x");
    }
  } catch (error) {
    // do nothing
  }
  return data;
}

export function convertTxData(tx: any) {
  let res;
  if (tx && (Array.isArray(tx) || typeof tx === "object")) {
    const obj = {};
    Object.entries(tx).forEach(([key, value]) => {
      obj[key] = convertTxData(value);
    });
    res = obj;
  } else {
    res = tx;
  }
  return res;
}
