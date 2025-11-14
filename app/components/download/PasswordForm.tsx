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
    <div className="space-y-6">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        autoFocus
        disabled={downloading}
        className="block w-full h-12 px-4 text-foreground border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      />
      <button
        onClick={onSubmit}
        disabled={downloading || !password}
        className={`w-full h-12 flex items-center justify-center gap-2 px-4 text-base font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
          downloading || !password
            ? "bg-muted text-muted-foreground cursor-not-allowed" 
            : "bg-primary text-primary-foreground hover:bg-primary/90" 
      }`}
      >
        {downloading ? "Verificando..." : "Verificar"}
      </button>
    </div>
  );
}
