import { Elysia } from "elysia";
import { AuthRouter } from "./modules/auth";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(AuthRouter)
  .listen(51212);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
