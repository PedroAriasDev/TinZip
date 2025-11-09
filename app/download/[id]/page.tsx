"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadForm } from "@/app/components/download/test/DownloadForm";
import { LoadingComponent } from "@/app/components/download/LoadingComponent";
import { SuccessModal } from "@/app/components/download/test/SuccessModal";
import { ErrorModal } from "@/app/components/download/test/ErrorModal";
import { ExpirationWarning } from "@/app/components/download/test/ExpirationWarning";
import { InvalidPassword } from "@/app/components/download/test/InvalidPassword";
import { FileNotFound } from "@/app/components/download/test/FileNotFound";
import { use } from "react";
import { hashPassword } from "@/utils/hashPassword";
import { decryptZip } from "@/utils/decryptZip";

type FileMetadata = {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  expiresAt: string;
};

type PageStatus =
  | "idle"          // esperando a que ingrese contraseña
  | "loading"       // cargando datos desde backend
  | "success"       // descarga correcta
  | "invalidPass"   // contraseña incorrecta
  | "expired"       // archivo expirado
  | "notFound"      // id inexistente
  | "error";        // error fatal

export default function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<PageStatus>("idle");
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [modalError, setModalError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleVerify = async () => {
    setDownloading(true);
    setModalError("");

    try {
      // Hash de contraseña
      const password_hash = await hashPassword(password)
      const res = await fetch(`/api/validate/${id}?hash=${password_hash}`);
      const data = await res.json();

      if (!res.ok) {
        // Manejo de distintos errores
        if (res.status === 401) setStatus("invalidPass");
        else if (res.status === 404) setStatus("notFound");
        else if (res.status === 410) setStatus("expired");
        else setStatus("error");
        return;
      }

      // Éxito
      setMetadata(data.file);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
    } finally {
      setDownloading(false);
    }
  };

  const getAndDownloadFile = async () => {
    setDownloading(true);
    try {
      // Hash de contraseña
      const password_hash = await hashPassword(password);
      const res = await fetch(`/api/download/${id}?hash=${password_hash}`);

      if (!res.ok) {
        // ... (tu manejo de errores 401, 404, etc.)
        if (res.status === 401) setStatus("invalidPass");
        else if (res.status === 404) setStatus("notFound");
        else if (res.status === 410) setStatus("expired");
        else setStatus("error");
        return;
      }

      // --- ¡AQUÍ EMPIEZA LA MAGIA! ---

      // 3. Obtenemos el blob ENCRIPTADO
      const encryptedBlob = await res.blob();
      
      // 4. Lo convertimos a un ArrayBuffer
      const encryptedBuffer = await encryptedBlob.arrayBuffer();

      // 5. ¡Lo desciframos! (Usando la contraseña del state, NO el hash)
      const decryptedBuffer = await decryptZip(encryptedBuffer, password);

      // 6. Creamos un NUEVO blob, pero esta vez con el .zip real (descifrado)
      const decryptedZipBlob = new Blob([decryptedBuffer], { type: "application/zip" });
      
      // 7. Creamos la URL de descarga para el blob DESCIFRADO
      const url = window.URL.createObjectURL(decryptedZipBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = metadata?.filename || 'archivo.zip'; // Usa el nombre de los metadatos
      document.body.appendChild(a);
      a.click();

      // 8. Limpieza
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // --- FIN DE LA MAGIA ---
      
    } catch (err: any) {
      console.error(err);
      
      // 9. Captura el error de descifrado
      if (err.message.includes("Contraseña incorrecta")) {
        setStatus("invalidPass");
      } else {
        setStatus("error");
      }
    } finally {
      setDownloading(false);
    }
  }

  // Render condicional según status
  if (status === "loading") return <LoadingComponent />;

  if (status === "idle") {
    return (
      <div className="min-h-screen bg-background">
      <ErrorModal
        fullScreen
        title="Verifica tu descarga"
        description="Ingresa la contraseña para continuar con la descarga"
      >
        <DownloadForm
          password={password}
          setPassword={setPassword}
          downloading={downloading}
          onSubmit={handleVerify}
        />
        {modalError && <p className="text-destructive text-sm mt-2">{modalError}</p>}
      </ErrorModal>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen w-full p-4 md:p-12 flex flex-col items-center 
        bg-gradient-to-b from-primary/20 via-background to-green-100 
        dark:bg-gradient-to-b dark:from-background dark:to-primary/20">
      <SuccessModal
        metadata={metadata!}
        onClose={() => router.push("/")}
        onDownload={() => getAndDownloadFile()}
      />
      </div>
    );
  }

  if (status === "invalidPass") return <InvalidPassword onRetry={() => setStatus("idle")} />;
  if (status === "expired") return <ExpirationWarning onRetry={() => setStatus("idle")} />;
  if (status === "notFound") return <FileNotFound onRetry={() => setStatus("idle")} />;

  return <ErrorModal title="Error" description="Ocurrió un error inesperado" />;
}
