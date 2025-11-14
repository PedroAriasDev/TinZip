"use client";
import React from "react";

export function InvalidPassword({ onRetry }: { onRetry: () => void }) {
   return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-destructive/10 via-background to-destructive/20 px-6 text-center">
      <h2 className="text-2xl font-bold text-destructive mb-3">❌ Contraseña incorrecta</h2>
      <button
         onClick={onRetry}
         className="
           py-2 px-4 
           {/* CAMBIOS: Botón rojo -> Botón 'destructive' del tema */}
           bg-destructive text-destructive-foreground rounded 
           transition-all duration-200 
           hover:bg-destructive/90 hover:shadow-lg hover:scale-[1.03]
           active:scale-[0.98]
           focus:outline-none focus:ring-2 focus:ring-ring
         "
       >
         Reintentar
       </button>
     </div>
   );
}