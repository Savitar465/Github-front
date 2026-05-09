import Link from "next/link";
import { BookOpen, Globe, Lock, Trash2, Users, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { OrganizationDTO } from "@/types/organization";

type OrgCardProps = {
  org: OrganizationDTO;
  onDelete: (orgName: string) => Promise<void>;
  isPending?: boolean;
};

export function OrgCard({ org, onDelete, isPending }: OrgCardProps) {
  return (
    <li className="flex items-start gap-4 py-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-bold uppercase text-muted-foreground">
        {org.displayName[0]}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{org.displayName}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {org.visibility === "public" ? (
              <Globe className="size-3" />
            ) : (
              <Lock className="size-3" />
            )}
            {org.visibility === "public" ? "Pública" : "Privada"}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">/{org.name}</p>

        {org.description && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{org.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {org.membersCount} miembros
          </span>
          <span className="flex items-center gap-1">
            <UsersRound className="size-3" />
            {org.teamsCount} equipos
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3" />
            {org.reposCount} repos
          </span>
        </div>

        <div className="mt-2 flex gap-2">
          <Link
            href={`/orgs/${org.name}/teams`}
            className="text-xs font-medium text-primary hover:underline"
          >
            Ver equipos →
          </Link>
          <Link
            href={`/orgs/${org.name}/members`}
            className="text-xs font-medium text-primary hover:underline"
          >
            Ver colaboradores →
          </Link>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(org.name)}
        disabled={isPending}
        aria-label={`Eliminar organización ${org.name}`}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </li>
  );
}
