import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import { createFileRecord } from '@/lib/database/FileServices';
import { IFileRecord } from '@/models/FileRecord';

// --- PASO 1: Desactivar el bodyParser de Next.js ---
// Necesitamos que Next.js NO toque el body, para que 'formidable'
// pueda leer el stream de datos del formulario.
export const config = {
  api: {
    bodyParser: false,
  },
};

type DataResponse = {
  link: string;
}
type ErrorResponse = {
  error: String
}

const url = `${process.env.NODE_ENV == 'development' ? 'https://localhost:3000' : `${process.env.RENDER_URL}/download`}`

// --- PASO 2: Función helper para "promisificar" formidable ---
// formidable usa callbacks, pero nuestro handler es async/await.
const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    // Ajusta el límite de tamaño de archivo como necesites
    const form = formidable({ maxFileSize: 200 * 1024 * 1024 }); // 200MB

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // --- PASO 3: Parsear el FormData ---
    const { fields, files } = await parseForm(req);

    // --- PASO 4: Extraer datos (¡Formidable v3 envuelve todo en arrays!) ---
    
    // Helper para obtener el primer valor de un campo
    const getFieldValue = (fieldName: string): string | undefined => {
      const value = fields[fieldName];
      return Array.isArray(value) ? value[0] : undefined;
    };
    
    // Obtenemos el archivo. 'file' es el nombre que le diste en el FormData.
    const file = (files.file as FormidableFile[])[0];

    // Obtenemos los campos de texto
    const ownerEmail = getFieldValue('origin');
    const passwordHash = getFieldValue('password_hash');
    const title = getFieldValue('title');
    const originalName = getFieldValue('original_name');
    const description = getFieldValue('description');
    const recipientsJSON = getFieldValue('recipients');

    // Validación básica
    if (!file || !ownerEmail || !passwordHash ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    let recipientEmails: string[] | undefined;
    if (recipientsJSON) {
      try {
        recipientEmails = JSON.parse(recipientsJSON);
      } catch (e) {
        return res.status(400).json({ error: 'JSON de destinatarios inválido.' });
      }
    }

    // --- ¡IMPORTANTE! MANEJO DEL ARCHIVO ---
    // 'file' ahora es un objeto que contiene la información del archivo
    // subido a una carpeta temporal en el servidor.
    //
    // NO PUEDES guardar el archivo en el filesystem de Render (es efímero).
    //
    // En este punto, deberías tomar el archivo de `file.filepath` (la ruta temporal)
    // y subirlo a un servicio de almacenamiento en la nube como:
    // 1. Amazon S3
    // 2. Google Cloud Storage
    // 3. Cloudinary
    //
    // const fileUrl = await uploadToS3(file.filepath, file.originalFilename);
    //
    // Por ahora, solo guardaremos la *metadata* en MongoDB.

    // --- PASO 5: Crear el objeto para la DB ---
    const fileData: IFileRecord = {
      originalFilename: file.originalFilename || 'unknownfile.dat',
      fileSizeInBytes: file.size,
      ownerEmail: ownerEmail,
      passwordHash: passwordHash,
      title: title,
      description: description,
      recipientEmails: recipientEmails,
    };

    // --- PASO 6: Guardar la metadata en MongoDB ---
    const newFile = await createFileRecord(fileData);

    res.status(201).json({ link: `${url}/${newFile.id}` });

  } catch (error) {
    console.error(error); 
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: errorMessage });
  }
}