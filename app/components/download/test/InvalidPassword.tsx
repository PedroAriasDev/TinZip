"use client";
import React from "react";

export function InvalidPassword({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50">
      <h2 className="text-2xl font-bold text-red-700 mb-3">❌ Contraseña incorrecta</h2>
      <button
        onClick={onRetry}
        className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Reintentar
      </button>
    </div>
  );
}
