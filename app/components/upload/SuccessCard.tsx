type SuccessCardProps = {
  link: string;
  password: string;
  onClose: () => void; // función que resetea el formulario
};

export function SuccessCard({ link, password, onClose }: SuccessCardProps) {
  return (
    <div className="bg-secondary border border-border rounded-lg p-6 text-center">
    <p className="text-primary font-semibold mb-2">✅ Archivo enviado correctamente</p>
    <p className="text-muted-foreground mb-2">Contraseña: {password}</p>
    <a href={link} className="text-primary underline mb-4 block">{link}</a>
    <button
      onClick={onClose}
       className="bg-primary text-primary-foreground rounded-lg px-4 py-2 hover:bg-primary/90 transition"
      >
      Subir otro archivo
      </button>
    </div>
    );
}
