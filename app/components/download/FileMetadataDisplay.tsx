import React from "react";
import { formatFileSize} from "@/utils/formatFileSize";
import { formatDate } from "@/utils/formatDate";

type FileMetadata = {
  filename: string;
  size: number;
  createdAt: string;
  expiresAt: string;
};

type FileMetadataDisplayProps = {
  metadata: FileMetadata;
};

export function FileMetadataDisplay({ metadata }: FileMetadataDisplayProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <svg /* Icono de archivo */ >...</svg>
          <h2 className="text-xl font-semibold text-gray-900">Información del Archivo</h2>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start py-3 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Nombre del archivo</span>
          <span className="text-sm text-gray-900 font-semibold text-right ml-4">{metadata.filename}</span>
        </div>
        <div className="flex justify-between items-start py-3 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Tamaño</span>
          <span className="text-sm text-gray-900 font-semibold">{formatFileSize(metadata.size)}</span>
        </div>
        <div className="flex justify-between items-start py-3 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Fecha de creación</span>
          <span className="text-sm text-gray-900 font-semibold text-right ml-4">
            {formatDate(metadata.createdAt)}
          </span>
        </div>
        <div className="flex justify-between items-start py-3">
          <span className="text-sm font-medium text-gray-600">Expira el</span>
          <span className="text-sm text-gray-900 font-semibold text-right ml-4">
            {formatDate(metadata.expiresAt)}
          </span>
        </div>
      </div>
    </div>
  );
}