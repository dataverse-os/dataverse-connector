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
