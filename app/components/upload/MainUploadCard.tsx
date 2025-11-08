"use client"

import { useState } from "react"
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
  
  const handleReset = () => {
    setFiles([]);
    setFinalPassword("");
    setErrorMessage("");
    resetStatus();
  };

  if (status === "success") {
    return <SuccessCard link={link} password={finalPassword} onClose={handleReset} />;
  }

  if (status === "error") {
    return <ErrorCard message={errorMessage || "Ocurrió un error inesperado"} onClose={handleReset} />;
  }

  return (
    <div className="bg-white rounded-xl border shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Subir Archivos</h2>

      <Formik
        initialValues={{
          origin: "el_big_tin@bigtin.tin",
          destinatarios: "bruno_go_br_br@gmail.com",
          password: "",
          title: "Titulo por defecto",
          description: "Albion Online es un MMORPG no lineal, donde escribes tu propia historia sin limitarte a seguir un camino prefijado.",
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
              <Field name="origin" type="text" className="w-full border rounded-lg p-2" />
              <ErrorMessage name="origin" component="p" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium">Destinatarios</label>
              <Field name="destinatarios" type="text" className="w-full border rounded-lg p-2" />
              <ErrorMessage name="destinatarios" component="p" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium">Contraseña *</label>
              <div className="flex gap-2">
                <Field
                  name="password"
                  type="text"
                  value={values.password}
                  className="w-full border rounded-lg p-2"
                />
                <button
                  type="button"
                  onClick={() => setFieldValue("password", generateSecurePassword(12))}
                  className="bg-gray-200 text-gray-800 rounded-lg px-3 py-2 font-medium hover:bg-gray-300 transition"
                >
                  Generar
                </button>
              </div>
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium">Título</label>
              <Field name="title" type="text" className="w-full border rounded-lg p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium">Descripción</label>
              <Field as="textarea" name="description" rows="3" className="w-full border rounded-lg p-2" />
            </div>

            <div className={`border-2 rounded-lg p-6 text-center
              ${fileError ? "border-red-500 bg-red-50" : "border-blue-300 bg-blue-50 hover:bg-blue-100"}`}>
              
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
              <label htmlFor="file-upload" className="cursor-pointer text-blue-700 font-medium">
                Arrastra o selecciona archivos
              </label>

              {files.length > 0 && (
                <ul className="mt-3 text-sm text-gray-700 text-left">
                  {files.map((f, i) => (
                    <li key={i}>• {f.name}</li>
                  ))}
                </ul>
              )}

              {fileError && (
                <p className="text-red-500 text-sm mt-2">{fileError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || !dirty || isSubmitting || status === "uploading" || !!fileError || files.length === 0}
              className={`
                w-full rounded-lg py-2 font-semibold transition
                ${!isValid || !dirty || isSubmitting || status === "uploading" || !!fileError || files.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"}
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
