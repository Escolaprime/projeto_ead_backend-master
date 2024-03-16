import {
  STORAGE_NAME_BUCKET,
  STORAGE_TOKEN,
  STORAGE_URL,
} from "@shared/utils/enviroments";
import dayjs from "dayjs";
import ffmpeg from "ffmpeg-static";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { writeFile } from "fs/promises";
import { extname } from "path";
import { Upload } from "tus-js-client";
import supabase from "./Config";

type UploadParams = {
  fileName?: string;
  file: any;
};

type downloadParams = {
  fileName: string;
  path: string;
  download: boolean;
};

export const filename = (originalName: string) => {
  console.log(originalName);
  const ext = extname(originalName);
  const prefix = "DA_VIDEO";
  const timestamp = dayjs().unix();
  return `${prefix}_${timestamp}${ext}`;
};

export async function downloadFileFromBucket({
  fileName,
  path,
  download = false,
}: downloadParams) {
  const read = existsSync(path);
  if (read) {
    return console.log("video baixado");
  }
  const { data, error } = await supabase.storage
    .from(STORAGE_NAME_BUCKET)
    .download(`${fileName}`);

  if (error) {
    console.log(error);
    throw error;
  }
  try {
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (download) {
      return buffer;
    }
    if (path.split(".mp4").length === 0) {
      return writeFile(`${path}.mp4`, buffer);
    }
    await writeFile(path, buffer);
  } catch (error) {
    console.log(error);
  }
}

export async function removeVideo(url: string) {
  const { data, error } = await supabase.storage
    .from(STORAGE_NAME_BUCKET)
    .remove([`${url}`]);
  if (error) {
    console.log(error);
    throw error;
  }
}

export async function getVideoStream(url: string) {
  const { data } = supabase.storage
    .from(STORAGE_NAME_BUCKET)
    .getPublicUrl(`${url}`);

  return data;
}

export async function UploadFileToBucket({ file, fileName }: UploadParams) {
  // Verifica se o arquivo é um vídeo antes de tentar comprimi-lo
  if (file.mimetype.startsWith("video")) {
    // Salva o arquivo temporário
    const videoFilePath = `temp_${fileName}`;
    writeFileSync(videoFilePath, file.buffer);

    // Comprime o vídeo usando ffmpeg
    const compressedFilePath = `compressed_${fileName}`;
    await compressVideo(videoFilePath, compressedFilePath);

    // Cria um novo objeto de arquivo com o vídeo comprimido
    const compressedFile = {
      buffer: readFileSync(compressedFilePath),
      mimetype: file.mimetype,
    };

    // Remove o arquivo temporário do vídeo original e o arquivo comprimido
    unlinkSync(videoFilePath);
    unlinkSync(compressedFilePath);

    // Faz o upload do vídeo comprimido
    uploadFile(compressedFile, fileName);
  } else {
    // Se não for um vídeo, faz o upload do arquivo como está
    uploadFile(file, fileName);
  }
}

// Função para fazer o upload do arquivo
async function uploadFile(file, fileName) {
  const upload = new Upload(file.buffer, {
    endpoint: `${STORAGE_URL}/storage/v1/upload/resumable`,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    headers: {
      authorization: `Bearer ${STORAGE_TOKEN}`,
      "x-upsert": "true",
    },
    chunkSize: 6 * 1024 * 1024,
    metadata: {
      bucketName: STORAGE_NAME_BUCKET,
      objectName: fileName,
      contentType: file.mimetype,
    },
    onError: function (error) {
      console.log("Failed because: " + error);
    },
    onSuccess: function () {
      console.log("Upload finished:", upload.url);
    },
    onProgress: function (bytesUploaded, bytesTotal) {
      var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      console.log(bytesUploaded, bytesTotal, percentage + "%");
    },
  });

  // Inicia o upload
  upload.start();
}

// Função para comprimir o vídeo usando ffmpeg
async function compressVideo(inputFilePath, outputFilePath) {
  try {
    // Comando ffmpeg para comprimir o vídeo
    const command = `${ffmpeg} -i ${inputFilePath} -vf "scale=640:trunc(ow/a/2)*2" -c:v libx264 -preset medium -crf 28 ${outputFilePath}`;

    // Executa o comando ffmpeg
    const { stdout, stderr } = await require("util").promisify(
      require("child_process").exec
    )(command);

    console.log("Compression complete");
  } catch (error) {
    console.error("Error compressing video:", error);
  }
}
