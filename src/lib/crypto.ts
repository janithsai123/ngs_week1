/**
 * Hashes a plaintext passkey using browser native SHA-256 Web Crypto API.
 * Never exposes the plaintext passkey or stores it.
 */
export async function hashPasskey(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPasskey(inputPasskey: string, storedHash: string): Promise<boolean> {
  const inputHash = await hashPasskey(inputPasskey);
  return inputHash.toLowerCase() === storedHash.toLowerCase();
}
