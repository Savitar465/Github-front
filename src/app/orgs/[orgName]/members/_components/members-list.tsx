"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import type { CollaboratorRole, OrgMember } from "@/types/org-member";
import { RoleBadge } from "./role-badge";

const ROLES: { value: CollaboratorRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "developer", label: "Developer" },
  { value: "reporter", label: "Reporter" },
];

type MembersListProps = {
  members: OrgMember[];
  onRoleChange: (username: string, role: CollaboratorRole) => Promise<void>;
  onRemove: (username: string) => Promise<void>;
  pendingUsername?: string;
};

export function MembersList({
  members,
  onRoleChange,
  onRemove,
  pendingUsername,
}: MembersListProps) {
  if (members.length === 0) {
    return (
      <EmptyState
        title="Sin colaboradores"
        message="Invita al primer miembro usando el formulario de arriba."
      />
    );
  }

  return (
    <ul className="divide-y divide-border">
      {members.map((member) => (
        <li key={member.userId} className="flex items-center gap-3 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium uppercase text-muted-foreground">
            {member.username[0]}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{member.username}</p>
            <p className="text-xs text-muted-foreground">
              Desde {new Date(member.joinedAt).toLocaleDateString("es")}
            </p>
          </div>

          <RoleBadge role={member.role} />

          <select
            value={member.role}
            onChange={(e) => onRoleChange(member.username, e.target.value as CollaboratorRole)}
            disabled={pendingUsername === member.username}
            aria-label={`Cambiar rol de ${member.username}`}
            className="h-8 rounded-3xl border border-transparent bg-input/50 px-2.5 text-xs text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(member.username)}
            disabled={pendingUsername === member.username}
            aria-label={`Eliminar a ${member.username}`}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
