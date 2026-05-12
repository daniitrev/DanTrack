import { Elysia, t } from "elysia";
import { AuthPlugin } from "../../middleware/auth";
import { ReportService } from "./service";

export const ReportsRouter = new Elysia({ prefix: "/api/v1" })
  .use(AuthPlugin)
  .get(
    "reports/summary",
    async ({ query, currentUser }) => {
      try {
        const { startTime, endTime } = query;

        return await ReportService.getPeriodSummary(
          {
            startTime: startTime ? new Date(startTime) : undefined,
            endTime: endTime ? new Date(endTime) : undefined,
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
      query: t.Object({
        startTime: t.Optional(t.String()),
        endTime: t.Optional(t.String()),
      }),
    },
  )
  .get(
    "reports/by-project",
    async ({ query, currentUser }) => {
      try {
        const { startTime, endTime } = query;

        return await ReportService.sortByProject(
          {
            startTime: startTime ? new Date(startTime) : undefined,
            endTime: endTime ? new Date(endTime) : undefined,
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
      query: t.Object({
        startTime: t.Optional(t.String()),
        endTime: t.Optional(t.String()),
      }),
    },
  )
  .get(
    "reports/by-member",
    async ({ query, currentUser }) => {
      try {
        const { startTime, endTime } = query;

        return await ReportService.sortByMember(
          {
            startTime: startTime ? new Date(startTime) : undefined,
            endTime: endTime ? new Date(endTime) : undefined,
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
      query: t.Object({
        startTime: t.Optional(t.String()),
        endTime: t.Optional(t.String()),
      }),
    },
  )
  .get(
    "reports/daily",
    async ({ query, currentUser }) => {
      try {
        const { startTime, endTime, day } = query;

        return await ReportService.getDailyReports(
          {
            startTime: startTime ? new Date(startTime) : undefined,
            endTime: endTime ? new Date(endTime) : undefined,
            day: day ? new Date(day) : undefined,
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
      query: t.Object({
        startTime: t.Optional(t.String()),
        endTime: t.Optional(t.String()),
        day: t.Optional(t.String()),
      }),
    },
  );
