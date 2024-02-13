import { STORAGE_NAME_BUCKET } from "@shared/utils/enviroments";
import supabase from "./Config";
import { writeFile } from 'fs/promises'
import { existsSync } from "fs";
type UploadParams = {
  fileName: string,
  file: any
}

type downloadParams = {
  fileName: string,
  path: string
}
export async function UploadFileToBucket({ file, fileName }: UploadParams) {
  const { data, error } = await supabase.storage.from(STORAGE_NAME_BUCKET).upload(fileName, file)

  if (error) {
    console.log(error)
    throw error
  }
}

export async function downloadFileFromBucket({ fileName, path }: downloadParams) {
  const read = existsSync(path)
  console.log(read)
  if (read) {
    return console.log('video baixado')
  }
  const { data, error } = await supabase.storage.from(STORAGE_NAME_BUCKET).download(`${fileName}`)
  if (error) {
    console.log(error)
    throw error
  }
  const arrayBuffer = await data.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  if (path.split('.mp4').length === 0) {
    return writeFile(`${path}.mp4`, buffer)
  }
  await writeFile(path, buffer)
}



