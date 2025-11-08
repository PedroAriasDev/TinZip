"use client";

import { useState, useEffect, use } from "react";
import * as yup from "yup";

// Importar los nuevos componentes
import { LoadingComponent } from "@/app/components/download/LoadingComponent";
import { ErrorComponent } from "@/app/components/download/ErrorComponent";
import { ExpirationWarning } from "@/app/components/download/ExpirationWarning";
import { FileMetadataDisplay } from "@/app/components/download/FileMetadataDisplay";
import { DownloadForm } from "@/app/components/download/DownloadForm";


type FileMetadata = {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
};
type DownloadStatus = "idle" | "loading" | "error" | "ready";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .trim()
    .min(8, "La contraseña debe tener al menos 8 caracteres") 
    .required("Por favor, ingresa la contraseña"),
});

export default function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<DownloadStatus>("loading");
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return; //ver que solucion si no hay id
    const fetchMetadata = async () => {
      setStatus("loading")
      try {
        const response = await fetch(`/api/metadata/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "El enlace no es valido o ha expirado")
        }

        const data: FileMetadata = await response.json();
        setMetadata(data);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "No se pudieron obtener los datos del archivo");
      }
    };
    fetchMetadata();
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    setError("");

    try {
      await validationSchema.validate({ password }, { abortEarly: false });


      const response = await fetch(`/api/download/:${id}`, {   //este luego que peter termine, ver si coincide el path de la api
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ password: password }),
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Contraseña incorrecta o error al descargar");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;

      a.download = metadata?.filename || 'archivo.zip';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setTimeout(() => {
        setPassword("");
        setDownloading(false);
      }, 1500);

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setError(err.errors[0]); 
      } else if (err instanceof Error) {
        setError(err.message); 
      } else {
        setError("Un error desconocido ocurrió al descargar");
      }
      setDownloading(false);
    }
  };

  if (status === "loading") {
    return <LoadingComponent />;
  }

  if (status === "error" || !metadata) {
    return <ErrorComponent error={error} />;
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">Descargar Archivos Seguros</h1>
        </div>
        <ExpirationWarning hoursRemaining={metadata.hoursRemaining} /> {/*aca hay que modificar para mostrar las horas que faltan para que expire*/}
        
        <FileMetadataDisplay metadata={metadata} />

        <DownloadForm
          password={password}
          setPassword={setPassword}
          error={error}
          setError={setError}
          downloading={downloading}
          onSubmit={handleDownload}
        />

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Nota de seguridad:</span> Este archivo está cifrado...
          </p>
        </div>
      </div>
    </div>
  );
}