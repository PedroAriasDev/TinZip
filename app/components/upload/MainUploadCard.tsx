"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { hashPassword } from "@/utils/hashPassword"
import { useUpload } from "@/hooks/useUpload"
import { uploadSchema } from "@/utils/formValidation"
import { zipAndEncrypt } from "@/utils/zipAndEncrypt"
import { generateSecurePassword } from "@/utils/generatePassword"

export default function MainUploadCard() {
  const [files, setFiles] = useState<File[]>([])
  const { status, progress, downloadLink, uploadFiles } = useUpload()

  return (
    <div className="bg-white rounded-xl border shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Subir Archivos</h2>

      <Formik
        initialValues={{
          origin: "el_big_tin@bigtin.tin",
          destinatarios: "bruno_go_br_br@gmail.com",
          password: "",
          title: "Titulo por defecto",
          description: "Albion Online es un MMORPG no lineal, donde escribes tu propia historia sin limitarte a seguir un camino prefijado. Explora un amplio mundo abierto con 5 biomas únicos; todo lo que hagas tendrá repercusiones en el mundo. Con la economía orientada al jugador de Albion, los jugadores crean prácticamente todo el equipo a partir de los recursos que consiguen. El equipo que llevas define quién eres; cambia de arma y armadura para pasar de caballero a mago, o juega como una mezcla de ambas clases. Aventúrate en el mundo abierto enfrentándote a los habitantes y criaturas de Albion, inicia expediciones o adéntrate en mazmorras donde encontrarás enemigos aún más difíciles. Enfréntate a otros jugadores en encuentros en el mundo abierto, lucha por territorios o por ciudades enteras en batallas tácticas, relájate en tu isla privada donde podrás construir un hogar, cultivar cosechas y criar animales. Únete a un gremio; todo es mejor cuando se trabaja en grupo. Adéntrate ya en el mundo de Albion y escribe tu propia historia. ",
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

          resetForm()
          setFiles([])
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
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

            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100">
              <input
                type="file"
                multiple
                id="file-upload"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) setFiles(Array.from(e.target.files))
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
            </div>

            <button
              type="submit"
              disabled={isSubmitting || status === "uploading"}
              className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
            >
              {status === "uploading" ? `Subiendo... ${progress}%` : "Comprimir y Enviar"}
            </button>

            {status === "success" && (
              <div className="bg-green-50 border border-green-300 rounded-lg p-3 mt-3">
                <p className="text-green-700 text-sm mb-1">✅ Archivo enviado correctamente</p>
                <p className="text-green-700 text-sm mb-1">{values.password}</p>
                <a href={downloadLink} className="text-green-600 underline text-sm">{downloadLink}</a>
              </div>
            )}

            {status === "error" && (
              <p className="text-red-500 text-sm mt-3">❌ Error al subir el archivo. Intenta nuevamente.</p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}
