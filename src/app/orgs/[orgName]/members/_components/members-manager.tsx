"use client";

import { useState } from "react";
import { Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addOrgMember, removeOrgMember, updateOrgMemberRole } from "@/lib/services/org-members";
import type { CollaboratorRole, OrgMember } from "@/types/org-member";
import { InviteForm } from "./invite-form";
import { MembersList } from "./members-list";

type MembersManagerProps = {
  orgName: string;
  initialMembers: OrgMember[];
};

export function MembersManager({ orgName, initialMembers }: MembersManagerProps) {
  const [members, setMembers] = useState<OrgMember[]>(initialMembers);
  const [pendingUsername, setPendingUsername] = useState<string | undefined>();

  async function handleInvite(username: string, role: CollaboratorRole) {
    const newMember = await addOrgMember(orgName, { username, role });
    setMembers((prev) => [...prev, newMember]);
  }

  async function handleRoleChange(username: string, role: CollaboratorRole) {
    setPendingUsername(username);
    try {
      const updated = await updateOrgMemberRole(orgName, username, { role });
      setMembers((prev) => prev.map((m) => (m.username === username ? updated : m)));
    } finally {
      setPendingUsername(undefined);
    }
  }

  async function handleRemove(username: string) {
    setPendingUsername(username);
    try {
      await removeOrgMember(orgName, username);
      setMembers((prev) => prev.filter((m) => m.username !== username));
    } finally {
      setPendingUsername(undefined);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invitar colaborador</CardTitle>
          <CardDescription>
            Busca por username o email y asigna un rol para controlar el nivel de acceso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteForm onInvite={handleInvite} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <CardTitle>Colaboradores · {members.length}</CardTitle>
          </div>
          <CardDescription>
            <span className="font-medium text-amber-600 dark:text-amber-400">Owner</span>: acceso
            total ·{" "}
            <span className="font-medium text-blue-600 dark:text-blue-400">Developer</span>: push,
            branches, PRs ·{" "}
            <span className="font-medium text-muted-foreground">Reporter</span>: solo lectura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MembersList
            members={members}
            onRoleChange={handleRoleChange}
            onRemove={handleRemove}
            pendingUsername={pendingUsername}
          />
        </CardContent>
      </Card>
    </div>
  );
}
