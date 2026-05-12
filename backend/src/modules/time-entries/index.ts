import { Elysia, t } from "elysia";
import { AuthPlugin } from "../../middleware/auth";
import { TimeEntriesService } from "./service";

export const TimeEntriesRouter = new Elysia({ prefix: "/api/v1" })
  .use(AuthPlugin)
  .get(
    "time-entries",
    async ({ currentUser }) => {
      try {
        return await TimeEntriesService.getEntries(currentUser);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
  )
  .post(
    "time-entries",
    async ({ body, currentUser }) => {
      try {
        const { taskId } = body;
        return await TimeEntriesService.createEntry(
          {
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
        taskId: t.String(),
      }),
    },
  )
  .patch(
    "time-entries/:timeEntryId",
    async ({ params, body, currentUser }) => {
      try {
        const { timeEntryId } = params;
        const { taskId } = body;
        return await TimeEntriesService.updateEntry(
          {
            timeEntryId,
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
      params: t.Object({
        timeEntryId: t.String(),
      }),
      body: t.Object({
        taskId: t.Optional(t.String()),
      }),
    },
  )
  .delete(
    "time-entries/:timeEntryId",
    async ({ params, currentUser }) => {
      try {
        const { timeEntryId } = params;
        return await TimeEntriesService.deleteEntry(
          { timeEntryId },
          currentUser,
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      params: t.Object({
        timeEntryId: t.String(),
      }),
    },
  )
  .post(
    "time-entries/start",
    async ({ body, currentUser }) => {
      try {
        const { taskId } = body;
        return await TimeEntriesService.startTimeEntry({ taskId }, currentUser);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
      }
    },
    {
      body: t.Object({
          taskId: t.String(),
      }),
    },
  )
  .post("time-entries/stop", async ({ currentUser }) =>
{
    try {
        return await TimeEntriesService.endTimeEntry({}, currentUser);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error;
        }
    }
})
  .get("time-entries/current", async ({ currentUser }) => {
    try {
      return await TimeEntriesService.getActiveEntry(currentUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  });
