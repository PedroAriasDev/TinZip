"use client";
import { FileMetadataDisplay } from "@/app/components/download/FileMetadataDisplay";
import { FileRecordInfoApiResponse } from "@/app/api/validate/[id]/route";
import React from "react";

interface Props {
  metadata: FileRecordInfoApiResponse;
  onClose: () => void;
  onDownload: () => void
}

export function DownloadModal({ metadata, onClose, onDownload }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-card rounded-xl p-6 max-w-md w-full border border-border shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
          <svg
            className="w-6 h-6 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
           strokeWidth="2"
           >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
            />
           <polyline
              strokeLinecap="round"
              strokeLinejoin="round"
              points="22 4 12 14.01 9 11.01"
           />
           </svg>
           Descarga lista
         </h2>
        <FileMetadataDisplay metadata={metadata} />
        <button
          onClick={onDownload}
          className="
             mt-4 w-full py-2 rounded font-semibold
             transition-all duration-200
             text-primary-foreground bg-primary
             hover:bg-primary/90 hover:shadow-md hover:scale-[1.02]
             active:scale-[0.97]
             focus:outline-none focus:ring-2 focus:ring-ring
           "
         >
           Descargar
         </button>
        <button
          onClick={onClose}
          className="
            mt-4 w-full py-2 rounded font-semibold
            transition-all duration-200
            text-muted-foreground bg-secondary
            hover:bg-input hover:shadow-md hover:scale-[1.02]
            active:scale-[0.97]
            focus:outline-none focus:ring-2 focus:ring-ring
          "
        >
          Ir a la página principal
        </button>
      </div>
    </div>
  );
}
