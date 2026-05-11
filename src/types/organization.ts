export type OrgVisibility = "public" | "private";

export type OrganizationDTO = {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  avatarUrl?: string;
  website?: string;
  visibility: OrgVisibility;
  membersCount: number;
  reposCount: number;
  teamsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrganizationPayload = {
  name: string;
  displayName: string;
  description?: string;
  website?: string;
  visibility: OrgVisibility;
};
