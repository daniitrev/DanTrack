import { prisma } from "../../lib/prisma";
import {
  CreateProjectDTO,
  CurrentUser,
  DeleteProjectDTO,
  DeleterMemberFromProjectDTO,
  DetailOfProjectDTO,
  NewMemberDTO,
  UpdateProjectDTO,
} from "./model";
import { ErrorHandler } from "../../../middelware/utils/error/error";

export class ProjectService {
  static async getAllProjects(currentUser: CurrentUser) {
    try {
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

      if (projects.length !== 0 && memberOfProject.length !== 0) {
        return {
          projects: projects,
          memberOfProject: memberOfProject,
        };
      } else if (memberOfProject.length === 0 && projects.length !== 0) {
        return { projects: projects, memberOfProject: null };
      }
      if (memberOfProject.length !== 0 && projects.length === 0) {
        return {
          memberOfProject,
          projects: null,
        };
      }

      return null;
    } catch (err) {
      if (err instanceof Error) throw err;
    }
  }

  static async createProject(dto: CreateProjectDTO, currentUser: CurrentUser) {
    try {
      if (!dto.title) {
        throw new ErrorHandler("Project title is required", 400);
      }

      const project = await prisma.project.findFirst({
        where: {
          title: dto.title,
        },
      });

      if (project) {
        throw new ErrorHandler(`Project "${dto.title}" already exists`, 409);
      }

      const createdProject = await prisma.project.create({
        data: {
          ownerId: currentUser.userId,
          title: dto.title,
          description: dto.description,
          status: dto.status,
        },
      });
      const createMemberOfProject = await prisma.memberProject.create({
        data: {
          projectId: createdProject.projectId,
          memberId: currentUser.userId,
          projectRole: "OWNER",
        },
      });

      return {
        createdProject,
        createMemberOfProject,
      };
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
    }
  }

  static async detailOfProject(
    dto: DetailOfProjectDTO,
    currentUser: CurrentUser,
  ) {
    try {
      if (!dto.projectId) {
        throw new ErrorHandler("Project ID is required", 400);
      }

      const project = await prisma.project.findUnique({
        where: {
          ownerId: currentUser.userId,
          projectId: dto.projectId,
        },
      });

      if (project === null) {
        throw new ErrorHandler("Project not found", 404);
      }

      const tasks = await prisma.task.findMany({
        where: {
          projectId: project.projectId,
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

      const timeEntry = tasks.filter(async (t) => {
        const entry = await prisma.timeEntry.findMany({
          where: {
            taskId: t.taskId,
            workerId: currentUser.userId,
          },
        });
      });
      const memberOfProject = await prisma.memberProject.findMany({
        where: {
          projectId: project.projectId,
        },
        include: {
          member: {
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
        project: project,
        tasks: tasks,
        timeEntry: timeEntry,
        memberOfProject: memberOfProject,
      };
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
    }
  }

  static async updateProject(dto: UpdateProjectDTO, currentUser: CurrentUser) {
    try {
      if (!dto.projectId) {
        throw new ErrorHandler("Project ID is required", 400);
      }

      const memberOfProject = await prisma.memberProject.findFirst({
        where: {
          projectId: dto.projectId,
          memberId: currentUser.userId,
        },
      });

      if (memberOfProject === null) {
        throw new ErrorHandler("Current user cannot update this project", 403);
      }

      const allowedRoles = ["OWNER", "EDITOR", "MEMBER"];

      if (
        memberOfProject.projectRole !== allowedRoles[0] &&
        memberOfProject.projectRole !== allowedRoles[1]
      ) {
        throw new ErrorHandler("Current user does not have permission", 403);
      }

      const project = await prisma.project.update({
        where: {
          projectId: dto.projectId,
        },
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
        },
      });

      return {
        project,
      };
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
    }
  }

  static async deleteProject(dto: DeleteProjectDTO, currentUser: CurrentUser) {
    try {
      if (!dto.projectId) {
        throw new ErrorHandler("Project ID is required", 400);
      }

      const project = await prisma.memberProject.findFirst({
        where: {
          projectId: dto.projectId,
          memberId: currentUser.userId,
        },
      });

      const allowedRoles = ["OWNER", "EDITOR", "MEMBER"];

      if (project === null) {
        throw new ErrorHandler("Project not found", 404);
      }

      if (project.projectRole !== allowedRoles[0]) {
        throw new ErrorHandler("Current user does not have permission", 403);
      }

      const deletedProject = await prisma.project.delete({
        where: {
          projectId: dto.projectId,
        },
      });

      return {
        project: deletedProject,
      };
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
    }
  }

  static async addMemberToProject(dto: NewMemberDTO, currentUser: CurrentUser) {
    try {
      if (!dto.projectId) {
        throw new ErrorHandler("Project ID is required", 400);
      }

      if (!dto.email) {
        throw new ErrorHandler("User email is required", 400);
      }

      const managerUser = await prisma.project.findFirst({
        where: {
          ownerId: currentUser.userId,
          projectId: dto.projectId,
        },
      });

      if (managerUser === null) {
        throw new ErrorHandler("Project not found", 404);
      }

      const currentProject = managerUser.projectId;

      if (currentProject === null) {
        throw new ErrorHandler("Project not found", 404);
      }
      const memberOfProject = await prisma.memberProject.findFirst({
        where: {
          projectId: managerUser.projectId,
        },
      });

      const allowedRoles = ["OWNER", "EDITOR", "MEMBER"];

      if (
        memberOfProject!.projectRole !== allowedRoles[0] &&
        memberOfProject!.projectRole !== allowedRoles[1]
      ) {
        throw new ErrorHandler("Current user does not have permission", 403);
      }

      const newMember = await prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });

      if (newMember === null) {
        throw new ErrorHandler("User not found", 404);
      }

      const isAlreadyExist = await prisma.memberProject.findFirst({
        where: {
          memberId: newMember.userId,
          projectId: dto.projectId,
        },
      });

      if (isAlreadyExist !== null) {
        throw new ErrorHandler("User is already a member of this project", 409);
      }

      const newUserAdding = await prisma.memberProject.create({
        data: {
          memberId: newMember.userId,
          projectId: dto.projectId,
          projectRole: "MEMBER",
        },
      });

      return {
        newUserAdding,
      };
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
    }
  }

  static async deleteMemberFromProject(
    dto: DeleterMemberFromProjectDTO,
    currentUser: CurrentUser,
  ) {
    try {
      if (!dto.projectId) {
        throw new ErrorHandler("Project ID is required", 400);
      }

      if (!dto.email) {
        throw new ErrorHandler("User email is required", 400);
      }

      const project = await prisma.memberProject.findFirst({
        where: {
          projectId: dto.projectId,
          memberId: currentUser.userId,
        },
      });
      const allowedRoles = ["OWNER", "EDITOR", "MEMBER"];

      if (project === null) {
        throw new ErrorHandler("Project not found", 404);
      }

      if (
        project.projectRole !== allowedRoles[0] &&
        project.projectRole !== allowedRoles[1]
      ) {
        throw new ErrorHandler("Current user does not have permission", 403);
      }

      const newMember = await prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });

      if (newMember === null) {
        throw new ErrorHandler("User not found", 404);
      }

      await prisma.memberProject.delete({
        where: {
          memberId_projectId: {
            memberId: newMember.userId,
            projectId: dto.projectId,
          },
        },
      });

      return {
        memberId: newMember.userId,
        projectId: dto.projectId,
      };
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
    }
  }
}
