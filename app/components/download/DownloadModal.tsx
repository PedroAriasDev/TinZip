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
          className="
            mt-4 w-full py-2 rounded font-semibold text-white bg-blue-600
            transition-all duration-200
            hover:bg-blue-700 hover:shadow-md hover:scale-[1.02]
            active:bg-blue-800 active:scale-[0.97]
          "
        >
          Descargar
        </button>
        <button
          onClick={onClose}
          className="
            mt-4 w-full py-2 rounded font-semibold text-white bg-blue-600
            transition-all duration-200
            hover:bg-blue-700 hover:shadow-md hover:scale-[1.02]
            active:bg-blue-800 active:scale-[0.97]
          "
        >
          Ir a la página principal
        </button>
      </div>
    </div>
  );
}
