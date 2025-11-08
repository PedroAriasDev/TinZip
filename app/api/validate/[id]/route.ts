import { NextRequest, NextResponse } from "next/server";
import { getFileRecordById, getRecordForPasswordCheck } from "@/lib/database/FileServices";
import mongoose from "mongoose";

export interface FileRecordInfoApiResponse {
  ownerEmail: string,
  fileSizeInBytes: number,
  title: string,
  description?: string,
  createdAt: string,
  expiresAt: string
}

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
      console.log('problema 1');
      console.log('password hash recibida: ', hashed_password);
      console.log('password hash guardado: ', record?.passwordHash)
      return NextResponse.json({ response: "invalid", file: null }, { status: 401 });
    }
    // Si el archivo esta expirado, devuelvo valid porq la password es correcta pero expiro
    if (record.isExpired) {
      return NextResponse.json({ error: "El archivo expiro" }, { status: 410 })
    }
    // Consigo info completa
    const recordInfo = await getFileRecordById(id);
    if (!recordInfo) return NextResponse.json({ response: "error", file: null }, { status: 500 }); // No deberia pasar

    const miliSecondsExpire = Number(process.env.MILI_SEG_EXP) || 72 * 60 * 60 * 1000;
    const expiresAtMiliSeconds = recordInfo.createdAt.getTime() + miliSecondsExpire;
    const expiresAt = new Date(expiresAtMiliSeconds);
    // Todo bien, devuelvo
    return NextResponse.json({
      response: "valid",
      file: {
        ownerEmail: recordInfo.ownerEmail,
        fileSizeInBytes: recordInfo.fileSizeInBytes,
        title: recordInfo.title,
        description: recordInfo.description || '',
        createdAt: recordInfo.createdAt,
        expiresAt: expiresAt 
      },
    });
  } catch (error) {
    // Si se ingresa un ID de longitud invalida, devuelve como si la contraseña fuese incorrecta
    // Esto es para que sea mas seguro y no se sepa si el archivo no existe
    // O la contraseña esta mal
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json({ response: "invalid", file: null }, { status: 401 });
    }
    console.log("Error al obtener metadata:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}