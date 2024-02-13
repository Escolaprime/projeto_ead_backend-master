import { config } from "dotenv";

const path = `${process.cwd()}/.env`;

config({ path });

export const { HTTP_PORT, HTTP_HOST } = process.env;

export const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;

export const { MEDIA_PATH } = process.env;
export const { NODE_ENV } = process.env;

export const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD } = process.env;


export const { STORAGE_URL,  STORAGE_TOKEN, STORAGE_NAME_BUCKET } = process.env