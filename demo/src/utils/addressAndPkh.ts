export function getAddressFromPkh(pkh: string) {
  return pkh.slice(pkh.lastIndexOf(":") + 1);
}
