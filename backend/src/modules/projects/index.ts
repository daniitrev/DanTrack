import { Elysia, t } from "elysia";
import { AuthPlugin } from "../../middleware/auth";
import { ProjectService } from "./service";

export const ProjectsRouter = new Elysia({ prefix: "/api/v1" })
  .use(AuthPlugin)
  .get("projects", async ({ currentUser }) => {
    try {
      return await ProjectService.getAllProjects(currentUser);
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
    }
  })
  .post(
    "projects",
    async ({ body, currentUser }) => {
      try {
        const { title, description, status } = body;
        return await ProjectService.createProject(
          { title, description, status },
          currentUser,
        );
      } catch (err: unknown) {
        if (err instanceof Error) throw err;
      }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        status: t.Union([
          t.Literal("TODO"),
          t.Literal("NOT_STARTED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("IN_REVIEW"),
          t.Literal("DONE"),
        ]),
      }),
    },
  )
  .get(
    "projects/:projectId",
    async ({ params, currentUser }) => {
      try {
        const { projectId } = params;
        return await ProjectService.detailOfProject({ projectId }, currentUser);
      } catch (err: unknown) {
        if (err instanceof Error) throw err;
      }
    },
    {
      params: t.Object({
        projectId: t.String(),
      }),
    },
  )
  .patch(
    "projects/:projectId",
    async ({ body, params, currentUser }) => {
      try {
        const { title, description, status } = body;
        const { projectId } = params;
        return await ProjectService.updateProject(
          { title, description, status, projectId },
          currentUser,
        );
      } catch (err: unknown) {
        if (err instanceof Error) throw err;
      }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        status: t.Union([
          t.Literal("TODO"),
          t.Literal("NOT_STARTED"),
          t.Literal("IN_PROGRESS"),
          t.Literal("IN_REVIEW"),
          t.Literal("DONE"),
        ]),
      }),
      params: t.Object({
        projectId: t.String(),
      }),
    },
  )
  .delete(
    "projects/:projectId",
    async ({ params, currentUser }) => {
      try {
        const { projectId } = params;
        return await ProjectService.deleteProject({ projectId }, currentUser);
      } catch (err: unknown) {
        if (err instanceof Error) throw err;
      }
    },
    {
      params: t.Object({
        projectId: t.String(),
      }),
    },
  )
  .post(
    "projects/:projectId/members",
    async ({ params, body, currentUser }) => {
      try {
        const { projectId } = params;
        const { email } = body;
        return await ProjectService.addMemberToProject(
          { projectId, email },
          currentUser,
        );
      } catch (err: unknown) {
        if (err instanceof Error) throw err;
      }
    },
    {
      body: t.Object({
        email: t.String(),
      }),
      params: t.Object({
        projectId: t.String(),
      }),
    },
  )
  .patch(
    "projects/:projectId/members",
    async ({ params, body, currentUser }) => {
      try {
        const { projectId } = params;
        const { email } = body;
        return await ProjectService.deleteMemberFromProject(
          { projectId, email },
          currentUser,
        );
      } catch (err: unknown) {
        if (err instanceof Error) throw err;
      }
    },
    {
      body: t.Object({
        email: t.String(),
      }),
      params: t.Object({
        projectId: t.String(),
      }),
    },
  );
