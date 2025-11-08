import axios from "axios"
import { UploadRequestData, UploadResponse } from "@/types/upload"

const API_URL = "/api/upload"

export async function uploadPackageService(payload: UploadRequestData): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append("origin", payload.origin)
  formData.append("password_hash", payload.password_hash)

  if (payload.title) formData.append("title", payload.title)
  if (payload.description) formData.append("description", payload.description)
  if (payload.recipients && payload.recipients.length > 0)
    formData.append("recipients", JSON.stringify(payload.recipients))

  formData.append("file", payload.file)

  const { data } = await axios.post<UploadResponse>(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }) 

  return data
}
// TODO AGREGAR original_name para pasarlo al backend