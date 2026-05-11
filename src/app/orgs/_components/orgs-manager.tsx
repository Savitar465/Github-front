"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { createOrganization, deleteOrganization } from "@/lib/services/organizations";
import type { CreateOrganizationPayload, OrganizationDTO } from "@/types/organization";
import { CreateOrgForm } from "./create-org-form";
import { OrgCard } from "./org-card";

type OrgsManagerProps = {
  initialOrgs: OrganizationDTO[];
};

export function OrgsManager({ initialOrgs }: OrgsManagerProps) {
  const [orgs, setOrgs] = useState<OrganizationDTO[]>(initialOrgs);
  const [showCreate, setShowCreate] = useState(false);
  const [pendingOrgName, setPendingOrgName] = useState<string | undefined>();
  const [deleteError, setDeleteError] = useState<string | undefined>();

  async function handleCreate(payload: CreateOrganizationPayload) {
    const newOrg = await createOrganization(payload);
    setOrgs((prev) => [newOrg, ...prev]);
    setShowCreate(false);
  }

  async function handleDelete(orgName: string) {
    setPendingOrgName(orgName);
    setDeleteError(undefined);
    try {
      await deleteOrganization(orgName);
      setOrgs((prev) => prev.filter((o) => o.name !== orgName));
      setPendingOrgName(undefined);
    } catch (err) {
      setPendingOrgName(undefined);
      setDeleteError(err instanceof Error ? err.message : "Error al eliminar organización");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {orgs.length} {orgs.length === 1 ? "organización" : "organizaciones"}
        </p>
        <Button size="sm" onClick={() => setShowCreate((v) => !v)}>
          <Plus className="size-4" />
          Nueva organización
        </Button>
      </div>

      {showCreate && (
        <CreateOrgForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      )}

      {deleteError && (
        <p className="text-sm text-destructive">{deleteError}</p>
      )}

      {orgs.length === 0 && !showCreate ? (
        <EmptyState
          title="Sin organizaciones"
          message="Crea tu primera organización para empezar a gestionar equipos y colaboradores."
        />
      ) : (
        <ul className="divide-y divide-border">
          {orgs.map((org) => (
            <OrgCard
              key={org.id}
              org={org}
              onDelete={handleDelete}
              isPending={pendingOrgName === org.name}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
