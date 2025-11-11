"use client";
import { FileMetadataDisplay } from "@/app/components/download/FileMetadataDisplay";
import { FileRecordInfoApiResponse } from "@/app/api/validate/[id]/route";

interface Props {
  metadata: FileRecordInfoApiResponse;
  onClose: () => void;
  onDownload: () => void
}

export function DownloadModal({ metadata, onClose, onDownload }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">✅ Descarga lista</h2>
        <FileMetadataDisplay metadata={metadata} />
        <button
          onClick={onDownload}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Descargar
        </button>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
