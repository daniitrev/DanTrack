export interface CreateTaskDTO {
  projectId: string;
  title: string;
  description: string;
  priority: Priority;
  status?: TaskStatus;
  deadline?: Date;
  assigneeId?: string;
}

export interface DetailOfTaskDTO {
  taskId: string;
}

export interface UpdateTaskDTO {
  taskId: string;
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  deadline?: Date;
  assigneeId?: string | null;
}

export interface DeleteTaskDTO {
  taskId: string;
}

export interface UpdatePriorityDTO {
  taskId: string;
  priority: Priority | undefined;
}

export interface UpdateStatusDTO {
  taskId: string;
  status: TaskStatus;
}

export type Priority = "ABSENT" | "LOW" | "HIGH" | "CRITICAL";
export type TaskStatus = "TODO" | "NOT_STARTED" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export interface GetAllTasksDTO {
  projectId: string;
}
