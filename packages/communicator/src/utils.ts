import { customAlphabet } from "nanoid";

export function generateNanoid() {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  const nanoid = customAlphabet(alphabet);
  return nanoid();
}
