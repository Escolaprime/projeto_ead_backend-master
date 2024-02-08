import dayjs from "dayjs";
import { Multer } from "multer";
import { extname } from "path";
import { AppError } from "../../errors/AppError";

type fileFilterCallback = (error: AppError, isValidFile: boolean) => void;
type filenameModifiedCallback = (
  error: Error | null,
  newFilename: string
) => void;

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: fileFilterCallback
) => {
  const regex = /\.(mp4|png)$/;
  if (!file.originalname.match(regex))
    return callback(new AppError("Video com formato invalido", 400), false);
  return callback(null, true);
};

export const filename = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: filenameModifiedCallback
) => {
  const ext = extname(file.originalname);
  const prefix = "DA_VIDEO";
  const timestamp = dayjs().unix();
  const filename = `${prefix}_${timestamp}${ext}`;
  return callback(null, filename);
};
