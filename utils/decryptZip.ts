export async function decryptZip(encryptedBuffer: ArrayBuffer, password: string): Promise<ArrayBuffer> {
  try {
    const enc = new TextEncoder();
    
    const salt = encryptedBuffer.slice(0, 16);
    const iv = encryptedBuffer.slice(16, 28); // 16 (salt) + 12 (iv)
    const data = encryptedBuffer.slice(28);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    // 'decrypted' es el ArrayBuffer del .zip original
    return decrypted;

  } catch (err) {
    console.error("Error al descifrar:", err);
    // Este error casi siempre significa "contraseña incorrecta"
    throw new Error("Contraseña incorrecta o archivo corrupto.");
  }
}