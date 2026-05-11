export type IssueState = "OPEN" | "CLOSED";

export type PaginationMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type LabelDTO = {
  id: string;
  repoId: string;
  name: string;
  color: string;
  description?: string;
};

export type AuthorSummary = {
  id: string;
  username: string;
};

export type IssueDTO = {
  id: string;
  repoId: string;
  number: number;
  title: string;
  body?: string;
  state: IssueState;
  author: AuthorSummary;
  assignee?: AuthorSummary;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  labels: LabelDTO[];
};

export type CommentDTO = {
  id: string;
  issueId: string;
  body: string;
  author: AuthorSummary;
  createdAt: string;
  updatedAt: string;
};

export type ListIssuesBody = {
  issues: IssueDTO[];
  pagination: PaginationMeta;
};

export type ListIssueCommentsBody = {
  comments: CommentDTO[];
};

export type ListLabelsBody = {
  labels: LabelDTO[];
};

export type CreateIssuePayload = {
  title: string;
  body?: string;
  assignee?: string;
  labels?: string[];
};

export type UpdateIssuePayload = {
  title?: string;
  body?: string;
  state?: IssueState;
  assignee?: string;
  labels?: string[];
};

export type CreateCommentPayload = {
  body: string;
};

export type CreateLabelPayload = {
  name: string;
  color: string;
  description?: string;
};
