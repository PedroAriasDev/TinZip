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
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <svg /* Icono de candado */ >...</svg>
          <h2 className="text-xl font-semibold text-gray-900">Descargar Archivo</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Ingresa la contraseña para acceder al archivo cifrado</p>
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
            <label htmlFor="password" className="block text-base font-semibold text-gray-900">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa la contraseña del archivo"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Ya no limpiamos el error aquí, el modal es independiente
              }}
              disabled={downloading}
              className="block w-full h-12 px-4 text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              autoFocus
            />
            <p className="text-sm text-gray-500">Usa la contraseña proporcionada por el remitente</p>
          </div>

          {/* El bloque de error que estaba aquí fue removido.
            El modal en page.tsx ahora se encarga de esto.
          */}

          <button
            type="submit"
            disabled={!password.trim() || downloading}
            className="w-full h-12 flex items-center justify-center gap-2 px-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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