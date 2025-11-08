"use client";

import { useState, useEffect, use } from "react";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { hashPassword } from "@/utils/hashPassword";

// Importar los nuevos componentes
import { LoadingComponent } from "@/app/components/download/LoadingComponent";
import { ErrorModal } from "@/app/components/download/ErrorComponent";
import { ExpirationWarning } from "@/app/components/download/ExpirationWarning";
import { FileMetadataDisplay } from "@/app/components/download/FileMetadataDisplay";
import { DownloadForm } from "@/app/components/download/DownloadForm";
import Link from "next/link";


type FileMetadata = {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  expiredAt: string; // TODO FALTA ARREGLAR ESTO PORQUE MI EQUIPO NO SE DECIDEW Y YO NO ENTIENDO UNA PORONGA
};
type DownloadStatus = "idle" | "loading" | "error" | "ready";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .trim()
    .min(8, "La contraseña debe tener al menos 8 caracteres") 
    .required("Por favor, ingresa la contraseña"),
});

function FatalErrorDisplay({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-extrabold text-red-600 mb-4">⚠️</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Ocurrió un error
        </h2>
        <p className="text-gray-600 mb-8">
          {error || "No pudimos cargar la información de este enlace."}
        </p>
        <Link
            href="/"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Ir al inicio
          </Link>
      </div>
    </div>
  );
}

export default function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<DownloadStatus>("loading");
  
  // 'error' es para errores fatales (carga)
  const [fatalError, setFatalError] = useState(""); 
  // 'modalError' es para errores reintentables (contraseña)
  const [modalError, setModalError] = useState(""); 

  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchMetadata = async () => {
      setStatus("loading");
      try {
        const response = await axios.get(`/api/metadata/${id}`);
        const data: FileMetadata = response.data;
        setMetadata(data);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        let errorMessage = "No se pudieron obtener los datos del archivo";
        if (axios.isAxiosError(err)) {
          const errorData = err.response?.data;
          errorMessage = errorData?.error || "El enlace no es válido o ha expirado";
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setFatalError(errorMessage);
      }
    };
    fetchMetadata();
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    setModalError(""); // Limpiar error modal anterior

    try {
      await validationSchema.validate({ password }, { abortEarly: false });
      const password_hash = await hashPassword(password);

      const response = await axios.get(`/api/download/${id}`, {
        params: { password_hash },
        responseType: 'blob',
      });

      const blob = response.data;
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
      setDownloading(false);
      
      if (err instanceof yup.ValidationError) {
        // Error de validación (ej. contraseña corta) -> Se muestra en el modal
        setModalError(err.errors[0]);
      } else if (axios.isAxiosError(err)) {
        // Error de la API (ej. contraseña incorrecta)
        let errorMsg = "Error al descargar";
        if (err.response?.data) {
          if (err.response.data instanceof Blob && err.response.data.type === 'application/json') {
            try {
              const errorJsonText = await err.response.data.text();
              const errorJson = JSON.parse(errorJsonText);
              errorMsg = errorJson.error || errorMsg;
            } catch (e) {
              if (err.response.status === 401) errorMsg = "Contraseña incorrecta";
              else if (err.response.status === 404) errorMsg = "Archivo no encontrado o expirado";
            }
          } else if (err.response.data.error) {
             errorMsg = err.response.data.error;
          } else if (err.response.status === 401) {
             errorMsg = "Contraseña incorrecta";
          }
        }
        // ESTE es el cambio clave: usamos el modal para el error
        setModalError(errorMsg); 
      } else if (err instanceof Error) {
        setModalError(err.message);
      } else {
        setModalError("Un error desconocido ocurrió al descargar");
      }
    }
  };

  if (status === "loading") {
    return <LoadingComponent />;
  }

  // Si la carga inicial falló, muestra el error fatal
  if (status === "error" || !metadata) {
    return <FatalErrorDisplay error={fatalError} />;
  }

  // Si la carga fue exitosa, muestra la página de descarga
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* El Modal de Error ahora vive aquí.
        Está oculto hasta que 'modalError' tenga contenido.
        Se cierra limpiando el estado 'modalError'.
      */}
      <ErrorModal 
        errorMessage={modalError} 
        onClose={() => setModalError("")} 
      />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">Descargar Archivos Seguros</h1>
        </div>
        
        
        <FileMetadataDisplay metadata={metadata} />

        <DownloadForm
          password={password}
          setPassword={setPassword}
          // Ya no pasamos props de error, el modal lo maneja
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