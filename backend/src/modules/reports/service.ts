import { prisma } from "../../lib/prisma";
import { GetDailyReports, GetPeriodSummaryDTO } from "./model";
import { CurrentUser } from "../projects/model";
import { Project, Task, TimeEntry } from "../../generated/prisma/client";
import { ErrorHandler } from "../../../middelware/utils/error/error";

export class ReportService {
  static async getPeriodSummary(
    dto: GetPeriodSummaryDTO,
    currentUser: CurrentUser,
  ) {
    try {
      if (!dto.startTime || !dto.endTime) {
        throw new ErrorHandler("Start date and end date are required", 400);
      }
      const startDate = dto.startTime?.getTime();
      const endDate = dto.endTime?.getTime();

      const tasks = await prisma.task.findMany({
        where: {
          creatorId: currentUser.userId,
        },
      });
      const projects = await prisma.project.findMany({
        where: {
          ownerId: currentUser.userId,
        },
      });
      const memberOfProject = await prisma.memberProject.findMany({
        where: {
          memberId: currentUser.userId,
        },
      });

      const timeEntry = await prisma.timeEntry.findMany({
        where: {
          workerId: currentUser.userId,
        },
      });
      const filteredTimeEntries = timeEntry.filter((time) => {
        const date = time.createdAt.getTime();
        return date >= startDate && date <= endDate;
      });
      const filteredTasks = tasks.filter((task) => {
        const date = task.createdAt.getTime();
        return date >= startDate && date <= endDate;
      });

      const filteredProjects = projects.filter((project) => {
        const date = project.createdAt.getTime();
        return date >= startDate && date <= endDate;
      });

      const filteredMembers = memberOfProject.filter((member) => {
        const date = member.assignedAt.getTime();
        return date >= startDate && date <= endDate;
      });

      return {
        projects: filteredProjects,
        tasks: filteredTasks,
        timeEntry: filteredTimeEntries,
        memberOfProject: filteredMembers,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
  static async sortByProject(
    dto: GetPeriodSummaryDTO,
    currentUser: CurrentUser,
  ) {
    try {
      if (!dto.startTime || !dto.endTime) {
        throw new ErrorHandler("Start date and end date are required", 400);
      }
      const startDate = dto.startTime?.getTime();
      const endDate = dto.endTime?.getTime();

      const project = await prisma.project.findMany({
        where: {
          ownerId: currentUser.userId,
        },
      });
      const tasks = await prisma.task.findMany({
        where: {
          creatorId: currentUser.userId,
        },
      });
      const timeEntry = await prisma.timeEntry.findMany({
        where: {
          workerId: currentUser.userId,
        },
      });
      const filteredProjects = project
        .filter((project) => {
          const date = project.createdAt.getTime();
          return date >= startDate && date <= endDate;
        })
        .map((project) => {
          const filterTask = tasks.filter(
            (task) => task.projectId === project.projectId,
          );
          const filteredTasksID = filterTask.map((time) => time.taskId);

          const filteredTimeEntries = timeEntry.filter((entry) =>
            filteredTasksID.includes(entry.taskId),
          );

          return {
            project,
            tasks: filterTask,
            timeEntries: filteredTimeEntries,
          };
        });
      return {
        filteredProjects,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
  static async sortByMember(
    dto: GetPeriodSummaryDTO,
    currentUser: CurrentUser,
  ) {
    try {
      if (!dto.startTime || !dto.endTime) {
        throw new ErrorHandler("Start date and end date are required", 400);
      }

      const startDate = dto.startTime?.getTime();
      const endDate = dto.endTime?.getTime();

      const projects = await prisma.project.findMany({
        where: {
          ownerId: currentUser.userId,
        },
      });

      const result = [];

      for (const project of projects) {
        const members = await prisma.memberProject.findMany({
          where: {
            projectId: project.projectId,
          },
        });
        const filteredMembers = members.filter((member) => {
          const date = member.assignedAt.getTime();
          return date >= startDate && date <= endDate;
        });

        const membersWithUsers = [];

        for (const member of filteredMembers) {
          const user = await prisma.user.findUnique({
            where: {
              userId: member.memberId,
            },
          });

          membersWithUsers.push({
            member,
            user,
          });
        }

        result.push({
          project,
          members: membersWithUsers,
        });
      }

      return {
        members: result,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
  static async getDailyReports(dto: GetDailyReports, currentUser: CurrentUser) {
    try {
      const groupByDay: Record<
        string,
        {
          projects: Project[];
          tasks: Task[];
          timeEntries: TimeEntry[];
        }
      > = {};

      if (dto.startTime && dto.endTime) {
        const startDate = dto.startTime?.getTime();
        const endDate = dto.endTime?.getTime();

        const tasks = await prisma.task.findMany({
          where: {
            creatorId: currentUser.userId,
          },
        });
        const projects = await prisma.project.findMany({
          where: {
            ownerId: currentUser.userId,
          },
        });

        const timeEntry = await prisma.timeEntry.findMany({
          where: {
            workerId: currentUser.userId,
          },
        });

        const filteredTimeEntries = timeEntry.filter((time) => {
          const date = time.createdAt.getTime();
          return date >= startDate && date <= endDate;
        });
        const filteredTasks = tasks.filter((task) => {
          const date = task.createdAt.getTime();
          return date >= startDate && date <= endDate;
        });

        const filteredProjects = projects.filter((project) => {
          const date = project.createdAt.getTime();
          return date >= startDate && date <= endDate;
        });

        for (const task of filteredTasks) {
          const dayKey = task.createdAt.toISOString().slice(0, 10);
          if (!groupByDay[dayKey]) {
            groupByDay[dayKey] = {
              projects: [],
              tasks: [],
              timeEntries: [],
            };
          }
          groupByDay[dayKey].tasks.push(task);
        }
        for (const entry of filteredTimeEntries) {
          const dayKey = entry.createdAt.toISOString().slice(0, 10);
          if (!groupByDay[dayKey]) {
            groupByDay[dayKey] = {
              projects: [],
              tasks: [],
              timeEntries: [],
            };
          }
          groupByDay[dayKey].timeEntries.push(entry);
        }

        for (const project of filteredProjects) {
          const dayKey = project.createdAt.toISOString().slice(0, 10);
          if (!groupByDay[dayKey]) {
            groupByDay[dayKey] = {
              projects: [],
              tasks: [],
              timeEntries: [],
            };
          }
          groupByDay[dayKey].projects.push(project);
        }
        return groupByDay;
      }
      if (dto.day) {
        const currentDate = dto.day?.toISOString().slice(0, 10);
        const tasks = await prisma.task.findMany({
          where: {
            creatorId: currentUser.userId,
          },
        });
        const projects = await prisma.project.findMany({
          where: {
            ownerId: currentUser.userId,
          },
        });

        const timeEntry = await prisma.timeEntry.findMany({
          where: {
            workerId: currentUser.userId,
          },
        });

        const filteredTimeEntries = timeEntry.filter((time) => {
          const date = time.createdAt.toISOString().slice(0, 10);
          return currentDate == date;
        });
        const filteredTasks = tasks.filter((task) => {
          const date = task.createdAt.toISOString().slice(0, 10);
          return currentDate == date;
        });

        const filteredProjects = projects.filter((project) => {
          const date = project.createdAt.toISOString().slice(0, 10);
          return currentDate == date;
        });

        for (const task of filteredTasks) {
          const dayKey = task.createdAt.toISOString().slice(0, 10);
          if (!groupByDay[dayKey]) {
            groupByDay[dayKey] = {
              projects: [],
              tasks: [],
              timeEntries: [],
            };
          }
          groupByDay[dayKey].tasks.push(task);
        }
        for (const entry of filteredTimeEntries) {
          const dayKey = entry.createdAt.toISOString().slice(0, 10);
          if (!groupByDay[dayKey]) {
            groupByDay[dayKey] = {
              projects: [],
              tasks: [],
              timeEntries: [],
            };
          }
          groupByDay[dayKey].timeEntries.push(entry);
        }

        for (const project of filteredProjects) {
          const dayKey = project.createdAt.toISOString().slice(0, 10);
          if (!groupByDay[dayKey]) {
            groupByDay[dayKey] = {
              projects: [],
              tasks: [],
              timeEntries: [],
            };
          }
          groupByDay[dayKey].projects.push(project);
        }
        return groupByDay;
      }
      throw new ErrorHandler("Should be at least one selected time", 400);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
