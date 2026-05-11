import { Elysia } from "elysia";
import {AuthRouter, AuthRouterSub} from "./modules/auth";
import { ProjectsRouter } from "./modules/projects";
import { TasksRouter } from "./modules/tasks";
import { TimeEntriesRouter } from "./modules/time-entries";
import { CORS } from "./middleware/cors";
import { ReportsRouter } from "./modules/reports";
import { ErrorHandler } from "../middelware/utils/error/error";

const app = new Elysia()
  .get("/", () => {})
  .use(CORS)
  .onError(({ error, set }) => {
    if (error instanceof ErrorHandler) {
      set.status = error.status;
      return { error: error.message };
    }

    set.status = 500;
    return {
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  })
    .use(AuthRouterSub)
  .use(AuthRouter)
  .use(ProjectsRouter)
  .use(TasksRouter)
  .use(TimeEntriesRouter)
  .use(ReportsRouter)
  .listen({
    hostname: process.env.HOST ?? "0.0.0.0",
    port: Number(process.env.PORT ?? 51212),
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
