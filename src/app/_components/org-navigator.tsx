"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, UsersRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getMyOrganizations } from "@/lib/services/organizations";
import type { OrganizationDTO } from "@/types/organization";

export function OrgNavigator() {
  const [orgName, setOrgName] = useState("");
  const [orgs, setOrgs] = useState<OrganizationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadOrgs() {
      try {
        setLoading(true);
        const data = await getMyOrganizations();
        setOrgs(data);
        setError(null);
      } catch (err) {
        setError("Error al cargar organizaciones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrgs();
  }, []);

  function navigate(section: "members" | "teams") {
    if (!orgName) return;
    router.push(`/orgs/${orgName}/${section}`);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="org-select">Seleccionar organización</Label>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Cargando organizaciones...
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : orgs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tienes organizaciones. Crea una primero.
          </p>
        ) : (
          <select
            id="org-select"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Selecciona una organización</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.name}>
                {org.displayName || org.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!orgName || loading}
          onClick={() => navigate("teams")}
        >
          <UsersRound className="size-4" />
          Ver equipos
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!orgName || loading}
          onClick={() => navigate("members")}
        >
          <Users className="size-4" />
          Ver colaboradores
        </Button>
      </div>
    </div>
  );
}
