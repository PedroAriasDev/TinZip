import JSZip from "jszip";
import { encryptZip } from "@/utils/encryptZip";

export async function zipAndEncrypt(files: File[], password: string): Promise<Blob> {
  const zip = new JSZip();

  for (const file of files) {
    const content = await file.arrayBuffer();
    zip.file(file.name, content);
  }

  const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });
  const encrypted = await encryptZip(zipBuffer, password);

  return new Blob([encrypted], { type: "application/octet-stream" });
}
