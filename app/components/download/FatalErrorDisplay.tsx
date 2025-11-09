"use client";

import Link from "next/link";
import React from "react";

export function FatalErrorDisplay({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/10 via-background to-destructive/20 flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-extrabold text-destructive mb-4">⚠️</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Ocurrió un error
        </h2>
        <p className="text-gray-600 mb-8">
          {error || "No pudimos cargar la información de este enlace."}
        </p>
        <Link
            href="/"
            className="px-5 py-2.5 text-sm font-semibold text-destructive-foreground bg-destructive rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Ir al inicio
          </Link>
      </div>
    </div>
  );
}