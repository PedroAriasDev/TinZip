import { createFileRecord } from '@/lib/database/FileServices';
import dbConnect from '@/lib/dbConnect';
import { IFileRecord } from '@/models/FileRecord';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { Readable } from 'stream';

const url = `${process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : `${process.env.RENDER_URL}`}`

  export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const db = mongoose.connection.db;
    if (!db) return new Response(JSON.stringify({ error: 'Error conectandose con la base de datos' }), { status: 500 });
    const bucket = new GridFSBucket(db, {
      bucketName: 'archivos' 
    });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return new Response(JSON.stringify({ error: 'No se subió ningún archivo' }), { status: 400 });

    const ownerEmail = formData.get('origin')?.toString();
    const passwordHash = formData.get('password_hash')?.toString();

    if (!ownerEmail || !passwordHash)
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400 });

    // --- 7. Lógica para guardar en GridFS ---
    
    // Convierte el stream web (de 'file') a un stream de Node.js
    const fileStreamNode = Readable.fromWeb(file.stream() as any);
    
    // Crea un stream de subida a GridFS
    const uploadStream = bucket.openUploadStream(file.name);
    
    // Pipe (conecta) el stream del archivo al stream de la base de datos
    fileStreamNode.pipe(uploadStream);

    // Espera a que la subida termine
    await new Promise<void>((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve();
      });
      uploadStream.on('error', (err) => {
        reject(new Error(`Error al subir a GridFS: ${err.message}`));
      });
    });
    
    // El ID del archivo guardado en GridFS
    const gridFsId = uploadStream.id; 
    // ------------------------------------


    const fileData: IFileRecord = {
      originalFilename: file.name,
      fileSizeInBytes: file.size,
      ownerEmail,
      passwordHash,
      title: formData.get('title')?.toString(),
      description: formData.get('description')?.toString(),
      recipientEmails: formData.get('recipients') ? JSON.parse(formData.get('recipients')!.toString()) : [],
      gridFsId: gridFsId
    };

    const newFile = await createFileRecord(fileData);

    return new Response(JSON.stringify({ link: `${url}/download/${newFile.id}` }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message || 'Error desconocido' }), { status: 500 });
  }
}
