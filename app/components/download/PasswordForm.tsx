"use client";
import React from "react";

interface Props {
  password: string;
  setPassword: (pass: string) => void;
  downloading: boolean;
  onSubmit: () => void;
}

export function PasswordForm({ password, setPassword, downloading, onSubmit }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="border p-2 rounded w-full"
      />
      <button
        onClick={onSubmit}
        disabled={downloading || !password}
        className={`w-full py-2 rounded font-semibold ${downloading || !password
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.97]"
        }`}
      >
        {downloading ? "Verificando..." : "Verificar"}
      </button>
    </div>
  );
}
