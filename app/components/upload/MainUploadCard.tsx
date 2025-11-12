"use client"

import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { hashPassword } from "@/utils/hashPassword"
import { useUpload } from "@/hooks/useUpload"
import { uploadSchema, validateFiles } from "@/utils/formValidation"
import { zipAndEncrypt } from "@/utils/zipAndEncrypt"
import { generateSecurePassword } from "@/utils/generatePassword"
import { SuccessCard } from "./SuccessCard";
import { ErrorCard } from "./ErrorCard";

export default function MainUploadCard() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const { status, progress, link, uploadFiles, resetStatus } = useUpload();
  const [finalPassword, setFinalPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);


  const handleReset = () => {
    setFiles([]);
    setFinalPassword("");
    setErrorMessage("");
    resetStatus();
  };

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(true)
    }
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const selected = Array.from(e.dataTransfer.files)
        setFiles(selected)
        const validation = validateFiles(selected)
        setFileError(validation.valid ? "" : validation.message)
      }
    }
    const handleDragLeave = () => setIsDragging(false)

    window.addEventListener("dragover", handleDragOver)
    window.addEventListener("drop", handleDrop)
    window.addEventListener("dragleave", handleDragLeave)

    return () => {
      window.removeEventListener("dragover", handleDragOver)
      window.removeEventListener("drop", handleDrop)
      window.removeEventListener("dragleave", handleDragLeave)
    }
  }, [])

  if (status === "success") {
    return <SuccessCard link={link} password={finalPassword} onClose={handleReset} />;
  }

  if (status === "error") {
    return <ErrorCard message={errorMessage || "Ocurrió un error inesperado"} onClose={handleReset} />;
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Subir Archivos</h2>
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 border-4 border-primary/50 rounded-xl pointer-events-none transition"></div>
      )}
      <Formik
        initialValues={{
          origin: "",
          destinatarios: "",
          password: "",
          title: "",
          description: "",
        }}
        validationSchema={uploadSchema}
        onSubmit={async (values, { resetForm }) => {
          if (files.length === 0) {
            alert("Selecciona al menos un archivo.")
            return
          }

          const password_hash = await hashPassword(values.password)
          const encryptedZip = await zipAndEncrypt(files, values.password)

          const recipients = values.destinatarios
            ? values.destinatarios.split(",").map(e => e.trim())
            : []

          await uploadFiles({
            origin: values.origin,
            recipients,
            title: values.title,
            description: values.description,
            password_hash,
            file: new Blob([encryptedZip], { type: "application/octet-stream" }),
          })
          setFinalPassword(values.password);
          resetForm()
          setFiles([])
        }}
      >
        {({ isSubmitting, isValid, dirty, setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Origen *</label>
              <Field name="origin" type="text" placeholder="el_big_tin@bigtin.tin" className="w-full border border-border rounded-lg p-2 bg-background focus:ring-2 focus:ring-ring" />
              <ErrorMessage name="origin" component="p" className="text-destructive text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium">Destinatarios</label>
              <Field name="destinatarios" type="text" placeholder="bruno_go_br_br@gmail.com" className="w-full border border-border rounded-lg p-2 bg-background focus:ring-2 focus:ring-ring" />
              <ErrorMessage name="destinatarios" component="p" className="text-destructive text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium">Contraseña *</label>
              <div className="flex gap-2">
                <Field
                  name="password"
                  type="text"
                  value={values.password}
                  className="w-full border border-border rounded-lg p-2 bg-background focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setFieldValue("password", generateSecurePassword(12))}
                  className="bg-secondary text-muted-foreground rounded-lg px-3 py-2 font-medium hover:bg-input transition"
                >
                  Generar
                </button>
              </div>
              <ErrorMessage name="password" component="p" className="text-destructive text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium">Título</label>
              <Field name="title" type="text" placeholder="Titulo por defecto" className="w-full border border-border rounded-lg p-2 bg-background focus:ring-2 focus:ring-ring" />
              <ErrorMessage name="title" component="p" className="text-destructive text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium">Descripción</label>
              <Field as="textarea" name="description" placeholder="Albion Online es un MMORPG no lineal, donde escribes tu propia historia sin limitarte a seguir un camino prefijado." rows="3" className="w-full border border-border rounded-lg p-2 bg-background focus:ring-2 focus:ring-ring" />
              <ErrorMessage name="description" component="p" className="text-destructive text-sm" />
            </div>

            <div
              onClick={() => document.getElementById("file-upload")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const selected = Array.from(e.dataTransfer.files)
                setFiles(selected)
                const validation = validateFiles(selected)
                setFileError(validation.valid ? "" : validation.message)
              }}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                ${fileError
                  ? "border-destructive bg-destructive/20"
                  : "border-primary/50 bg-secondary hover:bg-primary/10 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                }`}
            >
              <input
                type="file"
                multiple
                id="file-upload"
                className="hidden"
                onChange={(e) => {
                  if (!e.target.files) return;
                  const selected = Array.from(e.target.files);
                  setFiles(selected);

                  const validation = validateFiles(selected);
                  setFileError(validation.valid ? "" : validation.message);
                }}
              />
              <label htmlFor="file-upload" className={`cursor-pointer font-medium ${
                fileError ? "text-destructive" : "text-primary" // Color de texto dinámico
              }`}>
                Arrastra o selecciona archivos
              </label>

              {files.length > 0 && (
                <ul className="mt-3 text-sm text-muted-foreground text-left">
                  {files.map((f, i) => (
                    <li key={i}>• {f.name}</li>
                  ))}
                </ul>
              )}

              {fileError && (
                <p className="text-destructive text-sm mt-2">{fileError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || !dirty || isSubmitting || status === "uploading" || !!fileError || files.length === 0}
             className={`
                w-full rounded-lg py-2 font-semibold transition-all
                ${!isValid || !dirty || isSubmitting || status === "uploading" || !!fileError || files.length === 0
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] active:bg-primary/95 shadow-md"
                }
              `}
            >
              {status === "uploading" ? `Subiendo... ${progress}%` : "Comprimir y Enviar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
