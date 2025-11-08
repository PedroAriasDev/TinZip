import dbConnect from '@/lib/dbConnect';
import FileRecord, { IFileRecord, IFileRecordDocument } from '@/models/FileRecord';

/**
 * Crea un nuevo registro de archivo en la base de datos.
 */
export async function createFileRecord(fileData: IFileRecord): Promise<IFileRecordDocument> {
  await dbConnect();
  // 'create' toma la interface IFileRecord
  // y devuelve una Promesa de IFileRecordDocument
  const file = await FileRecord.create(fileData);
  return file;
}

/**
 * Busca un único registro de archivo por su ID.
 */
export async function getFileRecordById(id: string): Promise<IFileRecordDocument | null> {
  await dbConnect();
  const file = await FileRecord.findById(id);
  // El tipo de retorno ya sabe que esto puede ser IFileRecordDocument | null
  return file;
}

/**
 * Busca un archivo por ID y además incluye el passwordHash (para validación).
 */
export async function getRecordForPasswordCheck(id: string): Promise<IFileRecordDocument | null> {
  await dbConnect();
  // Mongoose es lo suficientemente inteligente para saber que .select()
  // sigue devolviendo el mismo tipo de documento
  const file = await FileRecord.findById(id).select('passwordHash createdAt isExpired gridFsId');
  return file;
}

/**
 * Busca un archivo por ID y devuelve el archivo
 */
export async function getRecordFile(id: string): Promise<IFileRecordDocument | null> {
  await dbConnect();
  const file = await FileRecord.findById(id).select('gridFsId createdAt'); // si le sacamos el createdAt no funciona, no se porque pero lo necesita
  return file;
}

