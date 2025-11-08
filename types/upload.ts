export interface UploadFormValues {
  origin: string                // email o nombre del remitente (obligatorio)
  recipients?: string[]         // emails de destinatarios (opcional)
  password: string              // contraseña (obligatorio o generada)
  title?: string                // opcional
  description?: string          // opcional
  files: File[]                 // archivos seleccionados
}

export interface UploadRequestData {
  origin: string
  recipients?: string[]
  title?: string
  description?: string
  password_hash: string         // contraseña hasheada antes de enviar
  file: Blob                    // ZIP cifrado (solo un archivo ZIP final)
}

export interface UploadResponse {
  downloadLink: string
}
