type SuccessCardProps = {
  link: string;
  password: string;
  onClose: () => void; // función que resetea el formulario
};

export function SuccessCard({ link, password, onClose }: SuccessCardProps) {
  return (
    <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
      <p className="text-green-700 font-semibold mb-2">✅ Archivo enviado correctamente</p>
      <p className="text-green-700 mb-2">Contraseña: {password}</p>
      <a href={link} className="text-green-600 underline mb-4 block">{link}</a>
      <button
        onClick={onClose}
        className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
      >
        Subir otro archivo
      </button>
    </div>
  );
}
