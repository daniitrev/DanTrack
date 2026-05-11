import {LoginDto, RegisterDto, UpdateDto} from "./model";
import {ErrorHandler} from "../../../middelware/utils/error/error";
import {prisma} from "../../lib/prisma";
import {generateTokens} from "../jwt/jwt";
import {deleteRefreshToken, findRefreshToken, refreshWhileList, revokeRefreshToken,} from "../jwt/refreshWhilteList";
import {CurrentUser} from "../projects/model";
import {JwtPayload} from "jsonwebtoken";

export class AuthService {
  static async register(body: RegisterDto) {
    try {
      const { email, username, password }: RegisterDto = body;
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: email }, { name: username }] },
      });
      if (user) {
        const message = "User already exist";
        return new ErrorHandler(message, 409);
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
        return new ErrorHandler("User not created", 500);
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
          jwt: tokens.accessToken,
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
        return new ErrorHandler(message, 404);
      }

      const isValid = await Bun.password.verify(password, user.password);
      if (!isValid) return new ErrorHandler("Invalid password", 401);

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
          jwt: tokens.accessToken,
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

      if (!stored) return new ErrorHandler("Invalid refresh token", 401);
      if (stored.revoked) return new ErrorHandler("Token revoked", 401);
      if (stored.expireAt < new Date())
        return new ErrorHandler("Token expired", 401);

      await deleteRefreshToken(stored.id);

      const user = await prisma.user.findUnique({
        where: { userId: stored.userId },
      });

      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }
      const tokens = generateTokens(user);
      await refreshWhileList({
        refreshToken: tokens.refreshToken,
        userId: user.userId,
      });

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

      if (!stored) return new ErrorHandler("Invalid refresh token", 401);
      if (stored.revoked) return new ErrorHandler("Token revoked", 401);
      if (stored.expireAt < new Date())
        return new ErrorHandler("Token expired", 401);

      const user = await prisma.user.findUnique({
        where: { userId: stored.userId },
      });
      if (!user) {
        throw new ErrorHandler("User not found", 404);
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
  static async update(body: UpdateDto, currentUser: CurrentUser) {
    try {
      const { email, image, password } = body;
      const username = body.name;
      const user = await prisma.user.findUnique({
        where: {
          userId: currentUser.userId,
        }
      });

      if (!user) {
        throw new ErrorHandler("User not found", 404);
      }

      if (!email && !username && !image && !password) {
        throw new ErrorHandler("No update fields provided", 400);
      }

      if (email && email !== user.email) {
        const emailUser = await prisma.user.findFirst({
          where: {
            email,
            userId: {
              not: currentUser.userId,
            },
          },
        });

        if (emailUser) {
          throw new ErrorHandler("User with current email already exist", 409);
        }
      }

      if (username && username !== user.name) {
        const nameUser = await prisma.user.findFirst({
          where: {
            name: username,
            userId: {
              not: currentUser.userId,
            },
          },
        });

        if (nameUser) {
          throw new ErrorHandler("User with current name already exist", 409);
        }
      }

      const passwordHash = password
          ? await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 10,
          })
          : undefined;

      const updatedUser = await prisma.user.update({
        where: {
          userId: user.userId,
        },
        data: {
          ...(image !== undefined ? { image } : {}),
          ...(passwordHash !== undefined ? { password: passwordHash } : {}),
          ...(username !== undefined ? { name: username } : {}),
          ...(email !== undefined ? { email } : {}),
        },
      });

      return {
        userId: updatedUser.userId,
        username: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
  static async getCurrentUser(currentUser: CurrentUser) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          userId: currentUser.userId,
        }
      })
      if (!user) {
        return new ErrorHandler("User not found", 401);
      }

      return user;
    }catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
