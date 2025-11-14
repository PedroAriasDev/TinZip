"use client"; // <--- ¡Añadido "use client"!

import React from "react";

export function ExpirationWarning({ onRetry }: { onRetry: () => void }) {
  return (
    // CAMBIOS: Usando las nuevas clases 'warning'
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-warning/10 via-background to-warning/20 px-6 text-center">
      <h2 className="text-2xl font-bold text-warning-foreground mb-3">⚠️ Este archivo ha expirado</h2>
      <button
        onClick={onRetry}
        className="py-2 px-4 bg-warning text-warning-foreground rounded hover:bg-warning/90 transition-colors"
       >
         Volver
      </button>
    </div>
   );
}