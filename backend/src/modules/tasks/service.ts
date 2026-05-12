import { CurrentUser } from "../projects/model";
import { prisma } from "../../lib/prisma";
import {
  CreateTaskDTO,
  DeleteTaskDTO,
  DetailOfTaskDTO,
  GetAllTasksDTO,
  UpdatePriorityDTO,
  UpdateStatusDTO,
  UpdateTaskDTO,
} from "./model";
import { ErrorHandler } from "../../../middelware/utils/error/error";

export class TasksService {
  static async getAllTasks(dto: GetAllTasksDTO, currentUser: CurrentUser) {
    try {
      if (!dto.projectId) {
        throw new ErrorHandler("Project ID is required", 400);
      }

      const membership = await prisma.memberProject.findFirst({
        where: {
          memberId: currentUser.userId,
          projectId: dto.projectId,
        },
      });

      if (membership === null) {
        throw new ErrorHandler(
          "Current user is not a member of this project",
          403,
        );
      }

      const tasksAll = await prisma.task.findMany({
        where: {
          projectId: dto.projectId,
        },
        include: {
          assignee: {
            select: {
              userId: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return {
        tasks: tasksAll,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async createTask(dto: CreateTaskDTO, currentUser: CurrentUser) {
    try {
      if (!dto.projectId) {
        throw new ErrorHandler("Project ID is required", 400);
      }

      if (!dto.title) {
        throw new ErrorHandler("Task title is required", 400);
      }

      const membership = await prisma.memberProject.findFirst({
        where: {
          memberId: currentUser.userId,
          projectId: dto.projectId,
        },
      });

      if (membership === null) {
        throw new ErrorHandler(
          "Current user is not a member of this project",
          403,
        );
      }

      const allowedRoles = ["OWNER", "EDITOR"];

      if (
        membership.projectRole !== allowedRoles[0] &&
        membership.projectRole !== allowedRoles[1]
      ) {
        throw new ErrorHandler(
          "Current user has no right to create tasks",
          403,
        );
      }

      const task = await prisma.task.findFirst({
        where: {
          title: dto.title,
          projectId: dto.projectId,
        },
      });

      if (task !== null) {
        throw new ErrorHandler(
          "Task with this title already exists in this project",
          409,
        );
      }

      if (dto.assigneeId) {
        const assigneeMembership = await prisma.memberProject.findFirst({
          where: {
            memberId: dto.assigneeId,
            projectId: dto.projectId,
          },
        });

        if (assigneeMembership === null) {
          throw new ErrorHandler("Assignee is not a member of this project", 400);
        }
      }

      const createdTask = await prisma.task.create({
        data: {
          title: dto.title,
          description: dto.description,
          priority: dto.priority,
          status: dto.status ?? "NOT_STARTED",
          deadline: dto.deadline ?? new Date(),
          assigneeId: dto.assigneeId,
          creatorId: currentUser.userId,
          projectId: dto.projectId,
        },
        include: {
          assignee: {
            select: {
              userId: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
      });
      return {
        task: createdTask,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async getTaskById(dto: DetailOfTaskDTO, currentUser: CurrentUser) {
    try {
      if (!dto.taskId) {
        throw new ErrorHandler("Task ID is required", 400);
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

      return {
        task: await prisma.task.findUnique({
          where: { taskId: task.taskId },
          include: {
            assignee: {
              select: {
                userId: true,
                email: true,
                name: true,
                image: true,
              },
            },
          },
        }),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async updateTask(dto: UpdateTaskDTO, currentUser: CurrentUser) {
    try {
      if (!dto.taskId) {
        throw new ErrorHandler("Task ID is required", 400);
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

      if (membership !== null) {
        const allowedRoles = ["OWNER", "EDITOR"];

        if (
          membership.projectRole !== allowedRoles[0] &&
          membership.projectRole !== allowedRoles[1]
        ) {
          throw new ErrorHandler(
            "Current user does not have permission to update tasks",
            403,
          );
        }

        if (dto.assigneeId && dto.assigneeId !== task.assigneeId) {
          const assigneeMembership = await prisma.memberProject.findFirst({
            where: {
              memberId: dto.assigneeId,
              projectId: task.projectId,
            },
          });

          if (assigneeMembership === null) {
            throw new ErrorHandler("Assignee is not a member of this project", 400);
          }
        }

        const updatedTaskInProject = await prisma.task.update({
          where: {
            taskId: task.taskId,
          },
          data: {
            ...(dto.title !== undefined ? { title: dto.title } : {}),
            ...(dto.description !== undefined
              ? { description: dto.description }
              : {}),
            ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
            ...(dto.status !== undefined ? { status: dto.status } : {}),
            ...(dto.deadline !== undefined ? { deadline: dto.deadline } : {}),
            ...(dto.assigneeId !== undefined ? { assigneeId: dto.assigneeId } : {}),
          },
          include: {
            assignee: {
              select: {
                userId: true,
                email: true,
                name: true,
                image: true,
              },
            },
          },
        });

        return {
          task: updatedTaskInProject,
        };
      }

      throw new ErrorHandler("Task cannot be updated", 400);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async deleteTask(dto: DeleteTaskDTO, currentUser: CurrentUser) {
    try {
      if (!dto.taskId) {
        throw new ErrorHandler("Task ID is required", 400);
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

      if (membership !== null) {
        const allowedRoles = ["OWNER", "EDITOR"];

        if (
          membership.projectRole !== allowedRoles[0] &&
          membership.projectRole !== allowedRoles[1]
        ) {
          throw new ErrorHandler(
            "Current user does not have permission to delete tasks",
            403,
          );
        }

        await prisma.task.delete({
          where: {
            taskId: task.taskId,
          },
        });

        return {
          task: task,
        };
      }

      throw new ErrorHandler("Task cannot be deleted", 400);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async updatePriority(
    dto: UpdatePriorityDTO,
    currentUser: CurrentUser,
  ) {
    try {
      if (!dto.taskId) {
        throw new ErrorHandler("Task ID is required", 400);
      }

      if (!dto.priority) {
        throw new ErrorHandler("Task priority is required", 400);
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

      if (membership !== null) {
        const allowedRoles = ["OWNER", "EDITOR"];

        if (
          membership.projectRole !== allowedRoles[0] &&
          membership.projectRole !== allowedRoles[1]
        ) {
          throw new ErrorHandler(
            "Current user does not have permission to update task priority",
            403,
          );
        }

        const updatedPriorityInProject = await prisma.task.update({
          where: {
            taskId: task.taskId,
          },
          data: {
            priority: dto.priority,
          },
        });

        return {
          task: updatedPriorityInProject,
        };
      }

      throw new ErrorHandler("Task priority cannot be updated", 400);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  static async updateStatus(dto: UpdateStatusDTO, currentUser: CurrentUser) {
    try {
      if (!dto.taskId) {
        throw new ErrorHandler("Task ID is required", 400);
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

      const updatedTask = await prisma.task.update({
        where: {
          taskId: dto.taskId,
        },
        data: {
          status: dto.status,
        },
        include: {
          assignee: {
            select: {
              userId: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return {
        task: updatedTask,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
