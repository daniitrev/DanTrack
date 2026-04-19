import { LoginDto, RegisterDto } from "./model";
import { ErrorHandler } from "../../../middelware/utils/error/error";
import { prisma } from "../../lib/prisma";
import { generateTokens } from "../jwt/jwt";
import {
  deleteRefreshToken,
  findRefreshToken,
  refreshWhileList,
  revokeRefreshToken,
} from "../jwt/refreshWhilteList";


export class AuthService {
  static async register(body: RegisterDto) {
    try {
      const { email, username, password }: RegisterDto = body;
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: email }, { name: username }] },
      });
      if (user) {
        const message = "User already exist";
        return new ErrorHandler(message);
      }
      const passwordHash = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      const createdUser = await prisma.user.create({
        data: {
          name: username,
          email: email,
          password: passwordHash,
        },
      });
      if (!createdUser) {
        return new ErrorHandler("User not created");
      }
      const tokens = generateTokens(createdUser);
      await refreshWhileList({
        refreshToken: tokens.refreshToken,
        userId: createdUser.userId,
      });

      const result = {
        tokens,
        data: {
          userId: createdUser.userId,
          username: createdUser.name,
          email: createdUser.email,
        },
      };
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async login(body: LoginDto) {
    try {
      const { email, password, username }: LoginDto = body;
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: email }, { name: username }] },
      });
      if (!user) {
        const message = "User is not exist";
        return new ErrorHandler(message);
      }

      const isValid = await Bun.password.verify(password, user.password);
      if (!isValid) return new ErrorHandler("Invalid password");

      const tokens = generateTokens(user);
      await refreshWhileList({
        refreshToken: tokens.refreshToken,
        userId: user.userId,
      });

      const result = {
        tokens,
        data: {
          userId: user.userId,
          username: user.name,
          email: user.email,
        },
      };
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async refresh(refreshToken: string) {
    try {
      const stored = await findRefreshToken(refreshToken);

      if (!stored) return new ErrorHandler("Invalid refresh token");
      if (stored.revoked) return new ErrorHandler("Token revoked");
      if (stored.expireAt < new Date())
        return new ErrorHandler("Token expired");

      await deleteRefreshToken(stored.id);

      const user = await prisma.user.findUnique({
        where: { userId: stored.userId },
      });

      if (!user) {
        throw new ErrorHandler("User not found");
      }
      const tokens = generateTokens(user);

      const result = {
        tokens,
        data: { userId: user.userId, username: user.name, email: user.email },
      };

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async logout(token: string) {
    try {
      const stored = await findRefreshToken(token);

      if (!stored) return new ErrorHandler("Invalid refresh token");
      if (stored.revoked) return new ErrorHandler("Token revoked");
      if (stored.expireAt < new Date())
        return new ErrorHandler("Token expired");

      const user = await prisma.user.findUnique({
        where: { userId: stored.userId },
      });
      if (!user) {
        throw new ErrorHandler("User not found");
      }

      await revokeRefreshToken(user.userId);

      return {
        message: "Token revoked",
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
