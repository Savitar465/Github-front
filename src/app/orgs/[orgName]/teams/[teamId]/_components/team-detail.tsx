"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PermissionBadge } from "@/components/common/permission-badge";
import type { TeamDTO, TeamMemberDTO, TeamRepoDTO } from "@/types/team";
import { TeamMembersTab } from "./team-members-tab";
import { TeamReposTab } from "./team-repos-tab";

type Tab = "members" | "repos";

type TeamDetailProps = {
  orgName: string;
  team: TeamDTO;
  initialMembers: TeamMemberDTO[];
  initialRepos: TeamRepoDTO[];
};

export function TeamDetail({ orgName, team, initialMembers, initialRepos }: TeamDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>("members");

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={`/orgs/${orgName}/teams`}>
          <ArrowLeft className="size-4" />
          Volver a equipos
        </Link>
      </Button>

      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-base font-bold uppercase text-muted-foreground">
          {team.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">{team.name}</h2>
            <PermissionBadge permission={team.permission} />
          </div>
          {team.description && (
            <p className="mt-1 text-sm text-muted-foreground">{team.description}</p>
          )}
        </div>
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab("members")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 pb-3 text-sm font-medium transition-colors",
              activeTab === "members"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="size-4" />
            Miembros
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs tabular-nums">
              {initialMembers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("repos")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 pb-3 text-sm font-medium transition-colors",
              activeTab === "repos"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="size-4" />
            Repositorios
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs tabular-nums">
              {initialRepos.length}
            </span>
          </button>
        </nav>
      </div>

      <div>
        {activeTab === "members" ? (
          <TeamMembersTab orgName={orgName} teamId={team.id} initialMembers={initialMembers} />
        ) : (
          <TeamReposTab orgName={orgName} teamId={team.id} initialRepos={initialRepos} />
        )}
      </div>
    </div>
  );
}
