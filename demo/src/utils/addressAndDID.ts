export function getAddressFromDid(did: string) {
  return did.slice(did.lastIndexOf(":") + 1);
}
