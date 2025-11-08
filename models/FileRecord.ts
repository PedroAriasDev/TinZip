import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFileRecord {
  originalFilename: string;
  ownerEmail: string;
  recipientEmails?: string[];
  fileSizeInBytes: number;
  title?: string;
  description?: string;
  passwordHash: string;
}

/**
 * Interface para el Documento de Mongoose.
 * Extiende las propiedades básicas, las de Mongoose y añade nuestros virtuals.
 */
export interface IFileRecordDocument extends IFileRecord, Document {
  createdAt: Date;
  updatedAt: Date;
  isExpired: boolean;
}

const FileRecordSchema: Schema<IFileRecordDocument> = new Schema({
  originalFilename: {
    type: String,
    required: true,
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  recipientEmails: {
    type: [String],
  },
  fileSizeInBytes: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false, // Ocultar por defecto en las consultas
  },
}, {
  // Añade createdAt y updatedAt
  timestamps: true,
  // Configura Mongoose para incluir virtuals cuando se convierte a JSON u objeto
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

/**
 * CAMPO VIRTUAL: isExpired
 * Calcula si el archivo ha expirado basado en createdAt.
 */
FileRecordSchema.virtual('isExpired').get(function(this: IFileRecordDocument) {
  const EXPIRATION_HOURS = 72;
  const expirationMilliseconds = EXPIRATION_HOURS * 60 * 60 * 1000;
  
  // 'this.createdAt' está disponible gracias a `timestamps: true`
  // y la interface IFileRecordDocument
  return (new Date().getTime() - this.createdAt.getTime()) > expirationMilliseconds;
});

const FileRecord: Model<IFileRecordDocument> = 
  mongoose.models.FileRecord as Model<IFileRecordDocument> || 
  mongoose.model<IFileRecordDocument>('FileRecord', FileRecordSchema);

export default FileRecord;