import fs from "fs/promises";
import { createReadStream } from "fs";
export const removeFile = async (path) => {
  return await fs.unlink(path);
};

export const streamFile = (path, options) => {
  const stream = createReadStream(path, { ...options, autoClose: true });

  stream.on("error", (error) => {
    return error;
  });


  return stream;
};
