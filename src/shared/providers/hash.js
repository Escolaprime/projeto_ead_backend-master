import { compare, hash } from "bcrypt";

export const compareHash = async (data, encrypted) =>
  await compare(data, encrypted);

export const generateHash = async (data, salts = 12) => hash(data, salts);
