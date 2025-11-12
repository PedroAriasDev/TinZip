// utils/formValidation.ts
import * as Yup from "yup"

export const MAX_TOTAL_BYTES = 200 * 1024 * 1024 // 200 MB total
export const MAX_FILE_BYTES = 200 * 1024 * 1024 // 200 MB por archivo (ajustable)
export const MIN_FILES = 1
export const MAX_FILES = 20 // si querés limitar número de archivos

// helper para validar emails simples
export function isValidEmail(email: string) {
  const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return re.test(email.trim())
}


// convierte string de destinatarios "a@x.com, b@y.com" -> string[]
export function parseDestinatarios(input?: string | null): string[] {
  if (!input) return []
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

// Validación de archivos: cantidad y tamaño total
export function validateFiles(files: File[] | null | undefined) {
  if (!files || files.length === 0) {
    return { valid: false, message: `Debes seleccionar al menos ${MIN_FILES} archivo(s).` }
  }
  if (files.length > MAX_FILES) {
    return { valid: false, message: `Máximo permitido: ${MAX_FILES} archivos.` }
  }

  let total = 0
  for (const f of files) {
    total += f.size
    if (f.size > MAX_FILE_BYTES) {
      return {
        valid: false,
        message: `El archivo "${f.name}" excede el tamaño máximo por archivo (${Math.round(
          MAX_FILE_BYTES / (1024 * 1024)
        )} MB).`,
      }
    }
  }

  if (total > MAX_TOTAL_BYTES) {
    return {
      valid: false,
      message: `Tamaño total excedido. Límite: ${Math.round(MAX_TOTAL_BYTES / (1024 * 1024))} MB.`,
    }
  }

  return { valid: true, message: "" }
}

/**
 * Yup schema para Formik
 *
 * Reglas aplicadas:
 * - origin: obligatorio; acepta email válido *o* nombre (sin @). Si contiene '@' se valida como email.
 * - destinatarios: opcional; si se provee, debe ser una lista de emails separados por comas.
 * - password: opcional (si no se provee el frontend generará una contraseña automática); si existe, mínimo 4 caracteres.
 * - title: opcional, hasta 100 chars
 * - description: opcional, hasta 500 chars
 */
export const uploadSchema = Yup.object().shape({
  origin: Yup.string()
    .required("Origen es obligatorio")
    .test(
      "origin-email",
      "Origen debe ser un email válido (sin @).",
      (value) => {
        if (!value) return false
        return isValidEmail(value)
      }
    ),
  destinatarios: Yup.string()
    .nullable()
    .test(
      "destinatarios-emails",
      "Los destinatarios deben ser emails válidos separados por comas.",
      (value) => {
        if (!value) return true
        const arr = parseDestinatarios(value)
        if (arr.length === 0) return true
        return arr.every((e) => isValidEmail(e))
      }
    ),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .test(
        "password-min",
        "La contraseña debe tener al menos 8 caracteres",
        (val) => !!val && val.length >= 8
    ),

  title: Yup.string().nullable().max(100, "Título: máximo 100 caracteres"),
  description: Yup.string().nullable().max(250, "Descripción: máximo 250 caracteres"),
})
