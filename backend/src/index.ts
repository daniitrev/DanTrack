import { Elysia } from "elysia";
import { AuthRouter } from "./modules/auth";
import { ProjectsRouter } from "./modules/projects";
import { TasksRouter } from "./modules/tasks";
import { TimeEntriesRouter } from "./modules/time-entries";
import {CORS} from "./middleware/cors";

const app = new Elysia()
  .get("/", () => {}).use(CORS)
  .use(AuthRouter)
  .use(ProjectsRouter)
  .use(TasksRouter)
  .use(TimeEntriesRouter)
  .listen(51212);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
