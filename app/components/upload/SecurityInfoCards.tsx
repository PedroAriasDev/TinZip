"use client"

export default function SecurityInfoCards() {
  
  return (
    <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-blue-600"
                >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Cifrado seguro</h3>
            <p className="text-sm text-gray-600">Tus archivos se cifran antes de almacenarse</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-3">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-indigo-600"
                >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 18v-6" />
                <path d="m9 15 3 3 3-3" />
                </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Compresión automática</h3>
            <p className="text-sm text-gray-600">Reducimos el tamaño para transferencias rápidas</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-purple-600"
                >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Expiración en 72h</h3>
            <p className="text-sm text-gray-600">Los archivos se eliminan automáticamente</p>
        </div>
    </div>
  )
}
