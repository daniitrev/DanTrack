import { prisma } from "../../lib/prisma";
import { CurrentUser } from "../projects/model";
import {
  CreateTimeEntryDTO,
  DeleteTimeEntryDTO, EndTimeEntryDTO,
  StartTimeEntryDTO,
  UpdateTimeEntryDTO,
} from "./model";
import { ErrorHandler } from "../../../middelware/utils/error/error";

export class TimeEntriesService {
  static async getEntries(currentUser: CurrentUser) {
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        where: {
          workerId: currentUser.userId,
        },
        include: {
          task: true,
        },
      });

      if (timeEntries.length === 0) {
        throw new ErrorHandler("Time entries not found", 404);
      }

      return {
        timeEntries,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }


  static async createEntry(dto: CreateTimeEntryDTO, currentUser: CurrentUser) {
    try {
      const activeEntry = await prisma.timeEntry.findFirst({
        where: {
          workerId: currentUser.userId,
          endTime: null,
        },
      });

      if (activeEntry) {
        throw new ErrorHandler("Current user already has an active timer", 409);
      }

      const task = await prisma.task.findUnique({
        where: {
          taskId: dto.taskId,
        },
      });

      if (!task) {
        throw new ErrorHandler("Task not found", 404);
      }

      if (task.projectId === null) {
        throw new ErrorHandler("Task is not assigned to any project", 400);
      }

      const membership = await prisma.memberProject.findFirst({
        where: {
          memberId: currentUser.userId,
          projectId: task.projectId,
        },
      });

      if (membership === null) {
        throw new ErrorHandler(
          "Current user is not a member of this project",
          403,
        );
      }

      const createdEntry = await prisma.timeEntry.create({
        data: {
          workerId: currentUser.userId,
          taskId: task.taskId,
          startTime: new Date(),
        },
      });

      return {
        timeEntry: createdEntry,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async updateEntry(dto: UpdateTimeEntryDTO, currentUser: CurrentUser) {
    try {
      const timeEntry = await prisma.timeEntry.findFirst({
        where: {
          timeEntryId: dto.timeEntryId,
          workerId: currentUser.userId,
        },
      });
      if (!timeEntry) {
        throw new ErrorHandler("Time entry not found", 404);
      }

      if (timeEntry.workerId !== currentUser.userId) {
        throw new ErrorHandler(
          "Current user does not have permission to update this time entry",
          403,
        );
      }

      if (!dto.taskId) {
        const updatedTimeEntry = await prisma.timeEntry.update({
          where: {
            timeEntryId: dto.timeEntryId,
          },
          data: {
            endTime: new Date(),
          },
        });

        return {
          timeEntry: updatedTimeEntry,
        };
      }

      const task = await prisma.task.findUnique({
        where: {
          taskId: dto.taskId,
        },
      });

      if (task === null) {
        throw new ErrorHandler("Task not found", 404);
      }

      if (task.projectId === null) {
        throw new ErrorHandler("Task is not assigned to any project", 400);
      }

      const membership = await prisma.memberProject.findFirst({
        where: {
          memberId: currentUser.userId,
          projectId: task.projectId,
        },
      });

      if (membership === null) {
        throw new ErrorHandler(
          "Current user is not a member of this project",
          403,
        );
      }

      const updatedEntry = await prisma.timeEntry.update({
        where: {
          timeEntryId: dto.timeEntryId,
        },
        data: {
          taskId: dto.taskId,
        },
      });
      return {
        timeEntry: updatedEntry,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async deleteEntry(dto: DeleteTimeEntryDTO, currentUser: CurrentUser) {
    try {
      const timeEntry = await prisma.timeEntry.findFirst({
        where: {
          timeEntryId: dto.timeEntryId,
          workerId: currentUser.userId,
        },
      });
      if (!timeEntry) {
        throw new ErrorHandler("Time entry not found", 404);
      }
      const deletedEntry = await prisma.timeEntry.delete({
        where: {
          timeEntryId: dto.timeEntryId,
        },
      });
      return {
        timeEntry: deletedEntry,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async startTimeEntry(
    dto: StartTimeEntryDTO,
    currentUser: CurrentUser,
  ) {
    return this.createEntry({ taskId: dto.taskId }, currentUser);
  }

  static async endTimeEntry(dto: EndTimeEntryDTO, currentUser: CurrentUser) {
    try {
      const timeEntry = dto.timeEntryId
        ? await prisma.timeEntry.findFirst({
            where: {
              timeEntryId: dto.timeEntryId,
              workerId: currentUser.userId,
            },
          })
        : await prisma.timeEntry.findFirst({
            where: {
              workerId: currentUser.userId,
              endTime: null,
            },
          });

      if (!timeEntry) {
        throw new ErrorHandler("Active time entry not found", 404);
      }

      const membership = await prisma.memberProject.findFirst({
        where: {
          memberId: currentUser.userId,
        },
      });

      if (membership === null) {
        throw new ErrorHandler(
          "Current user is not a member of this project",
          403,
        );
      }

      const endedEntry = await prisma.timeEntry.update({
        where: {
          timeEntryId: timeEntry.timeEntryId,
        },
        data: {
          endTime: new Date(),
        },
      });
      return {
        timeEntry: endedEntry,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async getActiveEntry(currentUser: CurrentUser) {
    try {
      const activeEntry = await prisma.timeEntry.findFirst({
        where: {
          workerId: currentUser.userId,
          endTime: null,
        },
      });
      if (!activeEntry) {
        throw new ErrorHandler("Active time entry not found", 404);
      }

      const membership = await prisma.memberProject.findFirst({
        where: {
          memberId: activeEntry.workerId,
        },
      });

      if (membership === null) {
        throw new ErrorHandler(
          "Current user is not a member of this project",
          403,
        );
      }

      return {
        timeEntry: activeEntry,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
