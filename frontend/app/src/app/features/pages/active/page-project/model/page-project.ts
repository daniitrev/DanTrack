import { HttpEntity } from '../../../../../shared/loadStateFunction';
import { TaskItem } from '../../page-task/model/page-task';

export type ProjectStatus = 'TODO' | 'NOT_STARTED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export interface ProjectPage {
  projectId?: string;
  title?: string;
  description?: string;
  status?: ProjectStatus;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: string;
}

export interface ProjectMember {
  memberId: string;
  projectRole: string;
  assignedAt: Date | string;
  member: {
    userId: string;
    email: string;
    name: string | null;
    image?: string | null;
  };
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
  tasks: TaskItem[];
  timeEntry: [];
  memberOfProject?: ProjectMember[] | null;
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
