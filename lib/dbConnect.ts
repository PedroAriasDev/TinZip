import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the DATABASE_URL environment variable inside .env.local or in your hosting provider'
  );
}

/**
 * Interface para nuestra conexión cacheada.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Accedemos a globalThis y le decimos a TypeScript que *podría*
 * tener una propiedad 'mongoose' de tipo MongooseCache.
 */
let cached = (globalThis as any).mongoose as MongooseCache;

if (!cached) {
  cached = (globalThis as any).mongoose = { conn: null, promise: null };
}

/**
 * Función principal de conexión.
 * Devuelve una promesa que resuelve en la instancia de Mongoose.
 */
async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // cached.conn es definitivamente asignado aquí, por lo que '!' es seguro.
  return cached.conn!;
}

export default dbConnect;