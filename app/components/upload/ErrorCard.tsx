type ErrorCardProps = {
  message: string;
  onClose: () => void;
};

export function ErrorCard({ message, onClose }: ErrorCardProps) {
  return (
    <div className="bg-red-200 border border-red-800 rounded-lg p-6 text-center">
      <p className="text-red-700 font-semibold mb-2">❌ Error al subir el archivo</p>
      <p className="text-red-700 mb-4">{message}</p>
      <button
        onClick={onClose}
        className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition"
      >
        Reintentar
      </button>
    </div>
  );
}
