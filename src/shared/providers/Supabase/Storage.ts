import { STORAGE_NAME_BUCKET } from "@shared/utils/enviroments";
import { decode } from "base64-arraybuffer";
import dayjs from "dayjs";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import { extname } from "path";
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
export async function UploadFileToBucket({ file }: UploadParams) {
  const ext = extname(file.originalname);
  const prefix = "DA_VIDEO";
  const timestamp = dayjs().unix();
  const filename = `${prefix}_${timestamp}${ext}`;
  const { data, error } = await supabase.storage
    .from(STORAGE_NAME_BUCKET)
    .upload(filename, decode(file.buffer.toString("base64")), {
      contentType: "video/mp4",
    });

  if (error) {
    console.log(error);
    throw error;
  }
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
