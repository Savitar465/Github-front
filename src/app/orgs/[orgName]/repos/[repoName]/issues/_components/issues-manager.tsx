"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { createIssue } from "@/lib/services/issues";
import type { CreateIssuePayload, IssueDTO } from "@/types/issue";
import { CreateIssueForm } from "./create-issue-form";
import { IssueCard } from "./issue-card";

type Filter = "all" | "OPEN" | "CLOSED";

const STATE_FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "OPEN", label: "Abiertos" },
  { value: "CLOSED", label: "Cerrados" },
];

type IssuesManagerProps = {
  orgName: string;
  repoName: string;
  initialIssues: IssueDTO[];
};

export function IssuesManager({ orgName, repoName, initialIssues }: IssuesManagerProps) {
  const [issues, setIssues] = useState<IssueDTO[]>(initialIssues);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  async function handleCreate(payload: CreateIssuePayload) {
    const newIssue = await createIssue(orgName, repoName, payload);
    setIssues((prev) => [newIssue, ...prev]);
    setShowCreate(false);
  }

  const openCount = issues.filter((i) => i.state === "OPEN").length;
  const closedCount = issues.filter((i) => i.state === "CLOSED").length;
  const filtered = filter === "all" ? issues : issues.filter((i) => i.state === filter);

  const countFor = (f: Filter) =>
    f === "all" ? issues.length : f === "OPEN" ? openCount : closedCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {STATE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-2 py-1 transition-colors hover:text-foreground ${
                filter === f.value ? "font-medium text-foreground" : ""
              }`}
            >
              {f.label}{" "}
              <span className="tabular-nums">{countFor(f.value)}</span>
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => setShowCreate((v) => !v)}>
          <Plus className="size-4" />
          Nuevo issue
        </Button>
      </div>

      {showCreate && (
        <CreateIssueForm
          orgName={orgName}
          repoName={repoName}
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {filtered.length === 0 && !showCreate ? (
        <EmptyState
          title="Sin issues"
          message={
            filter === "all"
              ? "No hay issues en este repositorio todavía."
              : filter === "OPEN"
              ? "No hay issues abiertos."
              : "No hay issues cerrados."
          }
        />
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((issue) => (
            <IssueCard
              key={issue.id}
              orgName={orgName}
              repoName={repoName}
              issue={issue}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
