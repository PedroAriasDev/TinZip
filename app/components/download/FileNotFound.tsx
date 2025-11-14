"use client";
import React from "react";

export function FileNotFound({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-destructive/10 via-background to-destructive/20 px-6 text-center">
      <h2 className="text-2xl font-bold text-destructive mb-3">❌ Archivo no encontrado</h2>
      <button
        onClick={onRetry}
        className="py-2 px-4 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
      >
        Volver
      </button>
     </div>
   );
}