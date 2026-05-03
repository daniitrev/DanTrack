import { Elysia, t } from "elysia";
import { AuthService } from "./service";
import { ErrorHandler } from "../../../middelware/utils/error/error";


const isProd = process.env.NODE_ENV === "production";

export const AuthRouter = new Elysia({ prefix: "/api/v1/auth" })
  .post(
    "register",
    async ({ body, cookie }) => {
      try {
        const result = await AuthService.register(body);

        if (result instanceof Error) {
          throw result;
        }
        if (result !== undefined) {
          cookie.refreshToken.set({
            value: result.tokens.refreshToken,
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
          });
          cookie.accessToken.set({
            value: result.tokens.accessToken,
            httpOnly: false,
            secure: isProd,
            sameSite: "lax",
            maxAge: 60 * 5,
            path: "/",
          });

          return { user: result.data };
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw err;
        }
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        username: t.String(),
        password: t.String({ minLength: 6 }),
      }),
    },
  )
  .post(
    "login",
    async ({ body, cookie }) => {
      try {
        const result = await AuthService.login(body);

        if (result instanceof Error) {
          throw result;
        }
        if (result !== undefined) {
          cookie.refreshToken.set({
            value: result.tokens.refreshToken,
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
          });
          cookie.accessToken.set({
            value: result.tokens.accessToken,
            httpOnly: false,
            secure: isProd,
            sameSite: "lax",
            maxAge: 60 * 5,
            path: "/",
          });

          return { user: result.data };
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw err;
        }
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        username: t.Optional(t.String()),
        password: t.String(),
      }),
    },
  )
  .post("refresh", async ({ cookie }) => {
    try {
      if (!cookie.refreshToken.value) {
        throw new ErrorHandler("Refresh token is missing");
      }
      const refreshTokenValue = cookie.refreshToken.value.toString();
      const result = await AuthService.refresh(refreshTokenValue);
      if (result instanceof Error) throw result;
      if (result !== undefined) {
        cookie.refreshToken.set({
          value: result.tokens.refreshToken,
          httpOnly: true,
          secure: isProd,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
        cookie.accessToken.set({
          value: result.tokens.accessToken,
          httpOnly: false,
          secure: isProd,
          sameSite: "lax",
          maxAge: 60 * 5,
          path: "/",
        });
        return { user: result.data };
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
    }
  })
  .post("logout", async ({ cookie }) => {
    try {
      if (!cookie.refreshToken.value) {
        throw new ErrorHandler("Refresh token is missing");
      }
      const refreshTokenValue = cookie.refreshToken.value.toString();
      const result = await AuthService.logout(refreshTokenValue);
      cookie.refreshToken.remove();
      cookie.accessToken.remove();
      return result;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
    }
  });
