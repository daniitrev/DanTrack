import { HttpEntity } from '../../../../../shared/loadStateFunction';

export interface ReportProject {
  projectId: string;
  title: string;
  status: string | null;
  description?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  ownerId: string;
}

export interface ReportTask {
  taskId: string;
  title: string;
  description?: string | null;
  status?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  projectId: string;
  creatorId: string;
}

export interface ReportTimeEntry {
  timeEntryId: string;
  startedAt?: Date | string | null;
  endedAt?: Date | string | null;
  duration?: number | null;
  comment?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  taskId: string;
  workerId: string;
}

export interface ReportMemberOfProject {
  memberId: string;
  projectRole: string;
  projectId: string;
  assignedAt: Date | string;
}

export interface ReportUser {
  userId: string;
  name?: string | null;
  email: string;
}

export interface ReportsPeriodQuery {
  startTime?: string;
  endTime?: string;
}

export interface ReportsDailyQuery extends ReportsPeriodQuery {
  day?: string;
}

export interface ReportsSummaryResponse {
  projects: ReportProject[];
  tasks: ReportTask[];
  timeEntry: ReportTimeEntry[];
  memberOfProject: ReportMemberOfProject[];
}

export interface ReportsByProjectItem {
  project: ReportProject;
  tasks: ReportTask[];
  timeEntries: ReportTimeEntry[];
}

export interface ReportsByProjectResponse {
  filteredProjects: ReportsByProjectItem[];
}

export interface ReportsByMemberItem {
  project: ReportProject;
  membersList: {
    member: ReportMemberOfProject;
    user: ReportUser | null;
  }[];
}

export interface ReportsByMemberResponse {
  members: ReportsByMemberItem[];
}

export interface ReportsDailyGroup {
  projects: ReportProject[];
  tasks: ReportTask[];
  timeEntries: ReportTimeEntry[];
}

export type ReportsDailyResponse = Record<string, ReportsDailyGroup>;

export interface ReportsPageData {
  summary: HttpEntity<ReportsSummaryResponse | null>;
  byProject: HttpEntity<ReportsByProjectResponse | null>;
  byMember: HttpEntity<ReportsByMemberResponse | null>;
  daily: HttpEntity<ReportsDailyResponse | null>;
}
