"use client"
import React, { useCallback } from "react"

interface FileDropzoneProps {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
}

export default function FileDropzone({ files, setFiles }: FileDropzoneProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const newFiles = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...newFiles])
  }, [setFiles])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100 transition-colors"
    >
      <input
        type="file"
        multiple
        id="file-upload"
        onChange={handleFileChange}
        className="hidden"
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
  )
}
