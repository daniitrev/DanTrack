import { HttpEntity } from '../../../../../shared/loadStateFunction';
import {TaskItem} from '../../task-page/model/task-page';

export type ProjectStatus =
  | 'TODO'
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'DONE';

export interface ProjectPage {
  projectId?: string;
  title?: string;
  description?: string;
  status?: ProjectStatus;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: string;
}
export interface CreateProject {
  title: string;
  description?: string | null;
  status: ProjectStatus;
}
export interface MemberProjectListRelationFilter {
  projectRole?: string;
  projectId?: string;
  assignedAt?: Date;
  member?: [];
  project?: [];
}


export interface ProjectPageResponse {
  projects: ProjectPage[];
  memberOfProject: MemberProjectListRelationFilter[];
}

export interface CreateProjectResponse {
  createdProject: ProjectPage;
  createMemberOfProject: MemberProjectListRelationFilter;
}

export interface ProjectDetailResponse {
    project: ProjectPage | null;
    tasks: TaskItem[],
    timeEntry: [],
    memberofProject?: MemberProjectListRelationFilter | null;
}

export interface ProjectUpdate {
  projectId?: string;
  title?: string;
  description?: string;
  status?: ProjectStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddMemberToCurrentProject {
  projectId?: string;
  email?: string;
}

export interface ProjectPageData {
  page: HttpEntity<ProjectPageResponse | null>;
  project: HttpEntity<ProjectDetailResponse | null>;
  member: HttpEntity<AddMemberToCurrentProject | null>;
}
