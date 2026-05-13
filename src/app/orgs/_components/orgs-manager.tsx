"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/empty-state";
import { createOrganization, deleteOrganization, searchOrganizations } from "@/lib/services/organizations";
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

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<OrganizationDTO[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await searchOrganizations(searchQuery);
        setSearchResults(result.organizations);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const displayedOrgs = searchResults !== null ? searchResults : orgs;

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
      if (searchResults) {
        setSearchResults((prev) => prev?.filter((o) => o.name !== orgName) ?? null);
      }
      setPendingOrgName(undefined);
    } catch (err) {
      setPendingOrgName(undefined);
      setDeleteError(err instanceof Error ? err.message : "Error al eliminar organización");
    }
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar organizaciones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {searchResults !== null ? (
            <>
              {searchResults.length} resultado{searchResults.length !== 1 && "s"} para &quot;{searchQuery}&quot;
            </>
          ) : (
            <>
              {orgs.length} {orgs.length === 1 ? "organización" : "organizaciones"}
            </>
          )}
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

      {displayedOrgs.length === 0 && !showCreate ? (
        <EmptyState
          title={searchResults !== null ? "Sin resultados" : "Sin organizaciones"}
          message={
            searchResults !== null
              ? `No se encontraron organizaciones para "${searchQuery}".`
              : "Crea tu primera organización para empezar a gestionar equipos y colaboradores."
          }
        />
      ) : (
        <ul className="divide-y divide-border">
          {displayedOrgs.map((org) => (
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
