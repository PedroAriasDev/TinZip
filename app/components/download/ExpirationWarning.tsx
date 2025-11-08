import React from "react";

type ExpirationWarningProps = {
  hoursRemaining: number;
};

export function ExpirationWarning({ hoursRemaining }: ExpirationWarningProps) {
  return (
    <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
      <div className="flex items-start gap-3">
        <svg /* Icono de reloj */ >...</svg>
        <div>
          <p className="font-semibold text-amber-900 mb-1">Este enlace expira automáticamente</p>
          <p className="text-sm text-amber-800">
            72 horas después de su creación. Tiempo restante:{" "}
            <span className="font-bold">{hoursRemaining} horas</span>
          </p>
        </div>
      </div>
    </div>
  );
}