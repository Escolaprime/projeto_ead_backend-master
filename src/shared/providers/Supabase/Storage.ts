import {
  STORAGE_NAME_BUCKET,
  STORAGE_TOKEN,
  STORAGE_URL,
} from "@shared/utils/enviroments";
import dayjs from "dayjs";
import { existsSync } from "fs";
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

export async function UploadFileToBucket({ file, fileName }: UploadParams) {
  const upload = new Upload(file.buffer, {
    endpoint: `${STORAGE_URL}/storage/v1/upload/resumable`, // Replace this with your TUS server endpoint
    retryDelays: [0, 3000, 5000, 10000, 20000], // Optional: Retry delays in milliseconds
    headers: {
      authorization: `Bearer ${STORAGE_TOKEN}`,
      "x-upsert": "true", // optionally set upsert to true to overwrite existing files
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

  // Start the upload
  upload.start();
}
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

  if (download) {
    return data;
  }
  if (error) {
    console.log(error);
    throw error;
  }
  try {
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(buffer);
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
