"use client";
import React from "react";

export function FileNotFound({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-700 mb-3">❌ Archivo no encontrado</h2>
      <button
        onClick={onRetry}
        className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Volver
      </button>
    </div>
  );
}
