import jwt from "jsonwebtoken";

export function generateAccessToken(id: string) {
  return jwt.sign({ id }, process.env.ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(id: string) {
  return jwt.sign({ id }, process.env.REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
}
