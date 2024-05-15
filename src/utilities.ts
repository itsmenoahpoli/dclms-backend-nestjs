import * as bcrypt from "bcrypt";

export const hashPassword = (rawPassword: string): string => {
  return bcrypt.hashSync(rawPassword, 15);
};

export const verifyHashedPassword = (rawPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(rawPassword, hashedPassword);
};

export const makeAcronyms = (words: string) => {
  return words
    .toLowerCase()
    .replaceAll("of", "")
    .split(" ")
    .map((i) => i.charAt(0))
    .join("")
    .toUpperCase();
};
