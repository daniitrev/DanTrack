import { HttpEntity } from '../../../../../shared/loadStateFunction';

export type Priority = 'ABSENT' | 'LOW' | 'HIGH' | 'CRITICAL';

export interface TaskItem {
  taskId: string;
  title: string;
  description: string;
  priority: Priority;
  createdAt: Date | string;
  updatedAt: Date | string;
  projectId: string | null;
  creatorId: string;
}

export interface TaskListResponse {
  tasks: TaskItem[];
}

export interface TaskDetailResponse {
  task?: TaskItem;
}

export interface CreateTaskPayload {
  projectId?: string;
  title: string;
  description: string;
  priority: Priority;
}

export interface UpdateTaskPayload {
  taskId: string;
  title: string;
  description: string;
  priority: Priority;
}

export interface UpdateTaskPriorityPayload {
  taskId: string;
  priority: Priority;
}

export interface DeleteTaskPayload {
  taskId: string;
}

export interface DeleteTaskResponse {
  taskId: string;
}

export interface GetTaskListPayload {
  projectId?: string;
}

export interface GetTaskByIdPayload {
  taskId: string;
  projectId: string;
}

export interface TaskPageData {
  page: HttpEntity<TaskListResponse | null>;
  currentTask: HttpEntity<TaskDetailResponse | null>;
}

export type TaskPage = TaskListResponse;
export type TaskPageAction = CreateTaskPayload;
