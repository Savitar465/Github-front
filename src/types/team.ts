export type TeamPermission = "read" | "write" | "admin";

export type TeamDTO = {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  permission: TeamPermission;
  membersCount: number;
  reposCount: number;
  createdAt: string;
};

export type TeamMemberDTO = {
  userId: string;
  username: string;
  avatarUrl?: string;
  addedAt: string;
};

export type TeamRepoDTO = {
  repoId: string;
  repoName: string;
  fullName: string;
  permission: TeamPermission;
  assignedAt: string;
};

export type CreateTeamPayload = {
  name: string;
  description?: string;
  permission: TeamPermission;
};

export type UpdateTeamPayload = {
  name?: string;
  description?: string;
  permission?: TeamPermission;
};

export type AddTeamRepoPayload = {
  permission: TeamPermission;
};
