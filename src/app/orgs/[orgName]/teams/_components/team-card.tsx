import Link from "next/link";
import { BookOpen, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PermissionBadge } from "@/components/common/permission-badge";
import type { TeamDTO } from "@/types/team";

type TeamCardProps = {
  team: TeamDTO;
  orgName: string;
  onDelete: (teamId: string) => Promise<void>;
  isPending?: boolean;
};

export function TeamCard({ team, orgName, onDelete, isPending }: TeamCardProps) {
  return (
    <li className="flex items-start gap-4 py-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold uppercase text-muted-foreground">
        {team.name[0]}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/orgs/${orgName}/teams/${team.id}`}
            className="text-sm font-semibold text-foreground hover:text-primary hover:underline"
          >
            {team.name}
          </Link>
          <PermissionBadge permission={team.permission} />
        </div>

        {team.description && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{team.description}</p>
        )}

        <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {team.membersCount} miembros
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3" />
            {team.reposCount} repos
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(team.id)}
        disabled={isPending}
        aria-label={`Eliminar equipo ${team.name}`}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </li>
  );
}
