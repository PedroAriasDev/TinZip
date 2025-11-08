"use client";

import React from "react";

type SuccessModalProps = {
  /** Si se debe mostrar el modal o no. */
  show: boolean;
  /** Función que se llama cuando el usuario cierra el modal (botón "Cerrar"). */
  onClose: () => void;
  /** Función que se llama cuando el usuario quiere subir (botón "Ir a Subir Archivos"). */
  onRedirect: () => void;
};

/**
 * Un modal que aparece después de una descarga exitosa,
 * invitando al usuario a subir sus propios archivos.
 */
export function SuccessModal({ show, onClose, onRedirect }: SuccessModalProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      aria-labelledby="success-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 sm:p-8 max-w-sm w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
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
        </div>

        <h1 id="success-modal-title" className="text-2xl font-bold text-gray-900 mb-2">
          ¡Descarga Completa!
        </h1>

        <p className="text-gray-600 mb-6">
          ¿Te gustaría enviar vos algún archivo comprimido?
        </p>

        <div className="space-y-3">
          <button
            onClick={onRedirect}
            className="w-full h-11 flex items-center justify-center px-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Ir a Subir Archivos
          </button>
          <button
            onClick={onClose}
            autoFocus
            className="w-full h-11 flex items-center justify-center px-4 text-base font-semibold text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}