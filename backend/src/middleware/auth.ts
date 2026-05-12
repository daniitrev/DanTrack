import { Elysia } from "elysia";
import jwt from "jsonwebtoken";
import { CurrentUser } from "../modules/projects/model";

export const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const AuthPlugin = new Elysia({}).derive(
  { as: "scoped" },
  ({ cookie, set }) => {
    const accessToken = cookie.accessToken?.value;

    if (typeof accessToken !== "string") {
      set.status = 401;
      throw new Error("Unauthorized");
    }

    try {
      const payload = jwt.verify(accessToken, JWT_SECRET) as { userId: string };

      return {
        currentUser: {
          userId: payload.userId,
        } satisfies CurrentUser,
      };
    } catch {
      set.status = 401;
      throw new Error("Unauthorized");
    }
  },
);
