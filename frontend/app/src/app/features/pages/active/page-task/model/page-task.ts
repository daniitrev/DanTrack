import { HttpEntity } from '../../../../../shared/loadStateFunction';

export type Priority = 'ABSENT' | 'LOW' | 'HIGH' | 'CRITICAL';
export type TaskStatus = 'TODO' | 'NOT_STARTED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export interface TaskAssignee {
  userId: string;
  email: string;
  name: string | null;
  image?: string | null;
}

export interface TaskItem {
  taskId: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  deadline: Date | string;
  assigneeId: string | null;
  assignee?: TaskAssignee | null;
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
  status: TaskStatus;
  deadline: string;
  assigneeId?: string | null;
}

export interface UpdateTaskPayload {
  taskId: string;
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  deadline?: string;
  assigneeId?: string | null;
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
}

export interface TaskPageData {
  page: HttpEntity<TaskListResponse | null>;
  currentTask: HttpEntity<TaskDetailResponse | null>;
}

export type TaskPage = TaskListResponse;
export type TaskPageAction = CreateTaskPayload;
