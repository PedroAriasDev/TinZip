type ErrorCardProps = {
  message: string;
  onClose: () => void;
};

export function ErrorCard({ message, onClose }: ErrorCardProps) {
  return (
    <div className="bg-destructive/20 border border-destructive/40 rounded-lg p-6 text-center">
      <p className="text-destructive font-semibold mb-2">❌ Error al subir el archivo</p>
      <p className="text-destructive/90 mb-4">{message}</p>
      <button
        onClick={onClose}
        className="bg-destructive text-destructive-foreground rounded-lg px-4 py-2 hover:bg-destructive/90 transition"
      >
        Reintentar
      </button>
    </div>
  );
}
