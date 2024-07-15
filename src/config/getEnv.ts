import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

export const getEnv = <T extends { [key: string]: any }>(
  key: keyof T
): T[keyof T] => {
  const value = env[key as string];

  if (value === undefined) {
    throw new Error(`${String(key)} is undefined`);
  }

  return value as T[keyof T];
};
