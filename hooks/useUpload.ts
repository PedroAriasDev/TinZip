"use client"

import { useState } from "react"
import { uploadPackageService } from "@/services/uploadService"
import { UploadRequestData, UploadResponse } from "@/types/upload"

export function useUpload() {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [progress, setProgress] = useState<number>(0)
  const [link, setLink] = useState<string>("")

  const resetStatus = () => {
    setStatus("idle");
    setProgress(0);
    setLink("");
  };

  const uploadFiles = async (payload: UploadRequestData) => {
    try {
      setStatus("uploading")
      setProgress(0)

      const response: UploadResponse = await uploadPackageService(payload)

      setStatus("success")
      setProgress(100)
      setLink(response.link)
      return response
    } catch (error) {
      console.error("Error al subir archivos:", error)
      setStatus("error")
      throw error
    }
  }

  return { status, progress, link, uploadFiles, resetStatus }
}
