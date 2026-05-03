import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ErrorHandler } from "../../../middelware/utils/error/error";
import { UserCreateInput } from "../../generated/prisma/models/User";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  const message = "JWT doesn't exist";
  throw new ErrorHandler(message);
}

export function generateAccessToken(user: UserCreateInput) {
  return jwt.sign({ userId: user.userId }, JWT_SECRET, {
    expiresIn: "20m",
  });
}

export function generateRefreshToken() {
  const refreshToken = crypto.randomBytes(16).toString("base64url");
  return refreshToken;
}

export function generateTokens(user: UserCreateInput) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  return { accessToken, refreshToken };
}
