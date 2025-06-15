import bycrypt from "bcryptjs";

const saltRounds = 10;

export const encryptPassword = async (password: string) => {
  const salt = await bycrypt.genSalt(saltRounds);
  const hashedPassword = await bycrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  const isMatch = await bycrypt.compare(password, hashedPassword);
  return isMatch;
};
