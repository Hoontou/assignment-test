import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

export const getEnv = <T>(
  key: keyof T,
  number: true | false = false
): T[keyof T] => {
  const value = env[key as string];

  if (value === undefined) {
    throw new Error(`${String(key)} is undefined`);
  }

  if (!number) {
    return value as T[keyof T];
  }

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    throw new TypeError(`${value} cannot be cast to number`);
  }
  return numberValue as T[keyof T];
};
