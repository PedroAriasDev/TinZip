import { NextRequest, NextResponse } from "next/server";
import { getRecordFile, getRecordForPasswordCheck } from "@/lib/database/FileServices";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const hashed_password = searchParams.get('hash');

    if (!id) {
      return NextResponse.json({ error: 'ID is mandatory' }, { status: 400 });
    }

    if (!hashed_password) {
      return NextResponse.json({ error: 'Password hash is mandatory' }, { status: 400 });
    }

    const record = await getRecordForPasswordCheck(id);
    // Si el archivo no existe o si el archivo existe pero la contraseña es invalida
    if (!record || record.passwordHash !== hashed_password) {
      return NextResponse.json({ response: "error", file: null }, { status: 200 });
    }
    // Si el archivo esta expirado, devuelvo valid porq la password es correcta pero expiro
    if (record.isExpired) {
      return NextResponse.json({ response: "error", file: null }, { status: 200})
    }

    // Consigo archivo
    const db = mongoose.connection.db
    if (!db) return NextResponse.json({ response: "Error conectandose con la base de datos" }, { status: 500 });
    const bucket = new GridFSBucket(db, {
      bucketName: 'archivos'
    });
    console.log('RECORD ES ', record);
    // const file = record.gridFsId;
    const file = await getRecordFile(id);
    if (!file) return NextResponse.json({ response: "Error consiguiendo el archivo" }, { status: 500 }); 
    const downloadStream = bucket.openDownloadStream(file.gridFsId);
    // Convertir el stream de Node.js a un Web Stream para NextResponse
    const data = Readable.from(downloadStream);

    return new NextResponse(data as any, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${record.title}"`,
        // Indicar que es un archivo binario genérico
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error) {
    // Si se ingresa un ID de longitud invalida, devuelve como si la contraseña fuese incorrecta
    // Esto es para que sea mas seguro y no se sepa si el archivo no existe
    // O la contraseña es incorrecta
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json({ response: "invalid", file: null }, { status: 200 });
    }
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}