"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Error detectado:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-extrabold text-red-600 mb-4">⚠️</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Ocurrió un error inesperado
        </h2>
        <p className="text-gray-600 mb-8">
          Algo salió mal mientras procesábamos tu solicitud.  
          Puedes intentar nuevamente o volver al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 text-sm font-medium text-red-700 border border-red-300 rounded-lg bg-white hover:bg-red-50 transition-colors"
          >
            Reintentar
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mt-6 bg-white border border-red-200 text-left rounded-lg p-4 text-sm text-gray-700 shadow-sm">
            <p className="font-semibold text-red-700">Detalles técnicos:</p>
            <pre className="mt-2 text-gray-600 whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
