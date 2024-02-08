import { sign, decode, verify } from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../utils/enviroments";

export const generateToken = (payload) => {
  return sign(payload, JWT_SECRET, {
    subject: String(payload.id) ?? "",
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const decodeToken = (token) => decode(token);

export const verifyToken = (token) => {
  return verify(token, JWT_SECRET);
};
