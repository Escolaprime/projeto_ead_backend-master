import { STORAGE_NAME_BUCKET } from "@shared/utils/enviroments";
import { existsSync } from "fs";
import { writeFile } from 'fs/promises';
import supabase from "./Config";
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

export async function removeVideo(url: string) {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_NAME_BUCKET) 
      .remove([`/${url}`]);

    if (error) {
      throw error;
    }
    console.log(`Vídeo ${url} excluído com sucesso.`);
  } catch (error) {
    console.error('Erro ao excluir o vídeo:', error.message);
  }
}



