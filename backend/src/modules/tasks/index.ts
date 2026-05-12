import { Elysia, t } from "elysia";
import { AuthPlugin } from "../../middleware/auth";
import { TasksService } from "./service";

const taskStatusSchema = t.Union([
  t.Literal("TODO"),
  t.Literal("NOT_STARTED"),
  t.Literal("IN_PROGRESS"),
  t.Literal("IN_REVIEW"),
  t.Literal("DONE"),
]);

const taskPrioritySchema = t.Union([
  t.Literal("ABSENT"),
  t.Literal("LOW"),
  t.Literal("HIGH"),
  t.Literal("CRITICAL"),
]);

export const TasksRouter = new Elysia({ prefix: "/api/v1" })
  .use(AuthPlugin)
  .get(
    "projects/:projectId/tasks",
    async ({ params, currentUser }) => {
      try {
        const { projectId } = params;
        return await TasksService.getAllTasks({ projectId }, currentUser);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      params: t.Object({
        projectId: t.String(),
      }),
    },
  )
  .post(
    "projects/:projectId/tasks",
    async ({ currentUser, body, params }) => {
      try {
        const { title, description, priority, status, deadline, assigneeId } = body;
        const { projectId } = params;

        return await TasksService.createTask(
          {
            title,
            description,
            priority,
            status,
            deadline: deadline ? new Date(deadline) : undefined,
            assigneeId,
            projectId,
          },
          currentUser,
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        priority: taskPrioritySchema,
        status: t.Optional(taskStatusSchema),
        deadline: t.Optional(t.String()),
        assigneeId: t.Optional(t.String()),
      }),
      params: t.Object({
        projectId: t.String(),
      }),
    },
  )
  .get(
    "tasks/:taskId",
    async ({ params, currentUser }) => {
      try {
        const { taskId } = params;
        return await TasksService.getTaskById({ taskId }, currentUser);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      params: t.Object({
        taskId: t.String(),
      }),
    },
  )
  .get(
    "task/:taskId",
    async ({ params, currentUser }) => {
      try {
        const { taskId } = params;
        return await TasksService.getTaskById({ taskId }, currentUser);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      params: t.Object({
        taskId: t.String(),
      }),
    },
  )
  .patch(
    "tasks/:taskId",
    async ({ body, params, currentUser }) => {
      try {
        const { title, description, priority, status, deadline, assigneeId } = body;
        const { taskId } = params;

        return await TasksService.updateTask(
          {
            title,
            description,
            priority,
            status,
            deadline: deadline ? new Date(deadline) : undefined,
            assigneeId,
            taskId,
          },
          currentUser,
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        priority: t.Optional(taskPrioritySchema),
        status: t.Optional(taskStatusSchema),
        deadline: t.Optional(t.String()),
        assigneeId: t.Optional(t.Nullable(t.String())),
      }),
      params: t.Object({
        taskId: t.String(),
      }),
    },
  )
  .patch(
    "task/:taskId",
    async ({ body, params, currentUser }) => {
      try {
        const { title, description, priority, status, deadline, assigneeId } = body;
        const { taskId } = params;

        return await TasksService.updateTask(
          {
            title,
            description,
            priority,
            status,
            deadline: deadline ? new Date(deadline) : undefined,
            assigneeId,
            taskId,
          },
          currentUser,
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        priority: t.Optional(taskPrioritySchema),
        status: t.Optional(taskStatusSchema),
        deadline: t.Optional(t.String()),
        assigneeId: t.Optional(t.Nullable(t.String())),
      }),
      params: t.Object({
        taskId: t.String(),
      }),
    },
  )
  .delete(
    "tasks/:taskId",
    async ({ params, currentUser }) => {
      try {
        const { taskId } = params;
        return await TasksService.deleteTask({ taskId }, currentUser);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      params: t.Object({
        taskId: t.String(),
      }),
    },
  )
  .delete(
    "task/:taskId",
    async ({ params, currentUser }) => {
      try {
        const { taskId } = params;
        return await TasksService.deleteTask({ taskId }, currentUser);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      params: t.Object({
        taskId: t.String(),
      }),
    },
  )
  .patch(
    "tasks/:taskId/status",
    async ({ body, params, currentUser }) => {
      try {
        const { taskId } = params;
        const { status } = body;
        return await TasksService.updateStatus({ taskId, status }, currentUser);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      body: t.Object({
        status: taskStatusSchema,
      }),
      params: t.Object({
        taskId: t.String(),
      }),
    },
  )
  .patch(
    "task/:taskId/priority",
    async ({ body, params, currentUser }) => {
      try {
        const { taskId } = params;
        const { priority } = body;
        return await TasksService.updatePriority(
          { taskId, priority },
          currentUser,
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      body: t.Object({
        priority: taskPrioritySchema,
      }),
      params: t.Object({
        taskId: t.String(),
      }),
    },
  );
