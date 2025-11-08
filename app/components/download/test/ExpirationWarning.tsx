"use client";
import React from "react";

export function ExpirationWarning({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-yellow-50">
      <h2 className="text-2xl font-bold text-yellow-700 mb-3">⚠️ Este archivo ha expirado</h2>
      <button
        onClick={onRetry}
        className="py-2 px-4 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      >
        Volver
      </button>
    </div>
  );
}
