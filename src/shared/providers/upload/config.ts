import { diskStorage, Options } from "multer";
import { fileFilter, filename } from "./filters";
import { NODE_ENV, MEDIA_PATH } from "@shared/utils/enviroments";

const DESTINATION = NODE_ENV === "production" ? MEDIA_PATH : "./tmp/videos";

export const uploadConfig: Options = {
  dest: DESTINATION,
  storage: diskStorage({
    destination: DESTINATION,
    filename,
  }),
  fileFilter,
};
