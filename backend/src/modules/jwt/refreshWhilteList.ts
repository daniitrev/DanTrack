import { RefreshModelRequest } from "./model";
import { ErrorHandler } from "../../../middelware/utils/error/error";
import { prisma } from "../../lib/prisma";
import { hashToken } from "./hash";

export async function refreshWhileList({
  refreshToken,
  userId,
}: RefreshModelRequest) {
  try {
    await prisma.refreshToken.create({
      data: {
        hashedToken: await hashToken(refreshToken),
        userId,
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), //30
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
  }
}

export async function findRefreshToken(refreshToken: string) {
  try {
    const refreshFound = await prisma.refreshToken.findUnique({
      where: {
        hashedToken: await hashToken(refreshToken),
      },
    });
    if (!refreshFound) {
      return null;
    }
    return refreshFound;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
  }
}

export async function deleteRefreshToken(id: string) {
  try {
    return await prisma.refreshToken.delete({
      where: { id },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
  }
}

export async function revokeRefreshToken(userId: string) {
  try {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revoked: false,
      },
      data: {
        revoked: true,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
  }
}
