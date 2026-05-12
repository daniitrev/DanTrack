export type CurrentUser = {
  userId: string;
};

export type ProjectStatus =
  | "TODO"
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

export interface CreateProjectDTO {
  title: string;
  description?: string;
  status: ProjectStatus;
}

export interface DetailOfProjectDTO {
  projectId: string;
}

export interface ProjectMemberView {
  memberId: string;
  projectRole: ProjectRole;
  assignedAt: Date;
  member: {
    userId: string;
    email: string;
    name: string | null;
    image?: string | null;
  };
}

export interface UpdateProjectDTO {
  projectId: string;
  title: string;
  description?: string;
  status: ProjectStatus;
}

export interface DeleteProjectDTO {
  projectId: string;
}

export interface NewMemberDTO {
  projectId: string;
  email: string;
}

export interface DeleterMemberFromProjectDTO {
  projectId: string;
  email: string;
}

export type ProjectRole = "OWNER" | "EDITOR" | "MEMBER";
