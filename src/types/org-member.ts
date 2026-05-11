export type CollaboratorRole = "owner" | "developer" | "reporter";

export type OrgMember = {
  userId: string;
  username: string;
  avatarUrl?: string;
  role: CollaboratorRole;
  joinedAt: string;
};

export type OrgMembersResponse = {
  members: OrgMember[];
};

export type AddMemberPayload = {
  username: string;
  role: CollaboratorRole;
};

export type UpdateRolePayload = {
  role: CollaboratorRole;
};
