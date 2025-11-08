import { NextResponse, type NextRequest } from "next/server";
const db = require('../../../../lib/database'); 

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID de paquete no proporcionado' }, { status: 400 });
    }

    // 1. Validar el paquete (existencia y expiración)
    const validation = await db.validatePackage(id);

    if (!validation.valid) {
      // --- CORRECCIÓN AQUÍ ---
      // Se añade [key: string] para permitir la indexación
      // con la variable validation.reason (que es de tipo string).
      const errorMessages: { [key: string]: string } = {
        'invalid_link': 'El link no es válido o no existe',
        'expired': 'El link de descarga ha expirado'
      };
      // ---------------------

      const status = validation.reason === 'expired' ? 410 : 404; 
      return NextResponse.json({ error: errorMessages[validation.reason] || 'Error desconocido' }, { status });
    }

    const pkg = validation.package;

    // 2. Calcular el tiempo restante (necesario para ExpirationWarning.tsx)
    const expiresAt = new Date(pkg.expiracion);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const hoursRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));

    // 3. Crear el objeto de metadatos públicos
    const metadata = {
      id: pkg.id,
      filename: pkg.nombre_archivo_original,
      size: pkg.tamaño_bytes,
      createdAt: pkg.fecha_creacion,
      expiresAt: pkg.expiracion,
      hoursRemaining: hoursRemaining
    };

    // 4. Devolver los metadatos
    return NextResponse.json(metadata, { status: 200 });

  } catch (error) {
    console.error('Error al obtener metadata:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: 'Error interno del servidor', details: message },
      { status: 500 }
    );
  }
}