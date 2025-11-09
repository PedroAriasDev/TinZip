import React from "react";

type DownloadFormProps = {
  password: string;
  setPassword: (value: string) => void;
  // error y setError ya no son necesarios aquí
  downloading: boolean;
  onSubmit: () => void;
};

export function DownloadForm({
  password,
  setPassword,
  downloading,
  onSubmit,
}: DownloadFormProps) {
  return (
      <div className="bg-card rounded-xl border-2 border-border shadow-lg overflow-hidden">      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <svg /* Icono de candado */ >...</svg>
          <h2 className="text-xl font-semibold text-foreground">Descargar Archivo</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Ingresa la contraseña para descargar el archivo</p>
      </div>

      <div className="p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="password" className="block text-base font-semibold text-foreground">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa la contraseña del archivo"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              disabled={downloading}
              className="block w-full h-12 px-4 text-foreground border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              autoFocus
            />
            <p className="text-sm text-muted-foreground">Usa la contraseña proporcionada por el remitente</p>
          </div>

          <button
            type="submit"
            disabled={!password.trim() || downloading}
            className="w-full h-12 flex items-center justify-center gap-2 px-4 text-base font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {downloading ? (
              <>
                <svg /* Icono de spinner */ >...</svg>
                Descargando...
              </>
            ) : (
              <>
                <svg /* Icono de descarga */ >...</svg>
                Descargar archivo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}