import { config } from "./config.ts";

async function getKey() {
  const source = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(config.tokenEncryptionKey),
  );

  return crypto.subtle.importKey("raw", source, "AES-GCM", false, ["decrypt"]);
}

export async function decryptToken(payload: string) {
  const [ivHex, tagHex, encryptedHex] = payload.split(".");
  const key = await getKey();
  const iv = Uint8Array.from(ivHex.match(/.{1,2}/g)!.map((value) => Number.parseInt(value, 16)));
  const tag = Uint8Array.from(tagHex.match(/.{1,2}/g)!.map((value) => Number.parseInt(value, 16)));
  const encrypted = Uint8Array.from(
    encryptedHex.match(/.{1,2}/g)!.map((value) => Number.parseInt(value, 16)),
  );
  const combined = new Uint8Array(encrypted.length + tag.length);
  combined.set(encrypted);
  combined.set(tag, encrypted.length);

  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, combined);
  return new TextDecoder().decode(decrypted);
}

export async function encryptToken(value: string) {
  const source = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(config.tokenEncryptionKey),
  );
  const key = await crypto.subtle.importKey("raw", source, "AES-GCM", false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(value)),
  );
  const ciphertext = encrypted.slice(0, encrypted.length - 16);
  const tag = encrypted.slice(encrypted.length - 16);
  const toHex = (bytes: Uint8Array) =>
    Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

  return `${toHex(iv)}.${toHex(tag)}.${toHex(ciphertext)}`;
}
