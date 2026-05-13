"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleDot, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getMyOrganizations } from "@/lib/services/organizations";
import { listRepositories } from "@/lib/api/repository-api";
import type { OrganizationDTO } from "@/types/organization";
import type { RepositoryDTO } from "@/lib/api/repository-api";

export function IssuesNavigator() {
  const [owner, setOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [orgs, setOrgs] = useState<OrganizationDTO[]>([]);
  const [repos, setRepos] = useState<RepositoryDTO[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  // Obtener username del token
  useEffect(() => {
    const token = localStorage.getItem("github_clone_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.preferred_username || payload.sub || null);
      } catch {
        setUsername(null);
      }
    }
  }, []);

  // Cargar organizaciones
  useEffect(() => {
    async function loadOrgs() {
      try {
        setLoadingOrgs(true);
        const data = await getMyOrganizations();
        setOrgs(data);
      } catch (err) {
        console.error("Error cargando organizaciones:", err);
      } finally {
        setLoadingOrgs(false);
      }
    }
    loadOrgs();
  }, []);

  // Cargar repositorios del usuario
  useEffect(() => {
    async function loadRepos() {
      const token = localStorage.getItem("github_clone_token") || "";
      if (!token) return;

      try {
        setLoadingRepos(true);
        const data = await listRepositories(token);
        setRepos(data.repositories || []);
      } catch (err) {
        console.error("Error cargando repositorios:", err);
      } finally {
        setLoadingRepos(false);
      }
    }
    loadRepos();
  }, []);

  // Filtrar repos por owner seleccionado
  const filteredRepos = owner
    ? repos.filter(r => r.ownerUsername === owner)
    : repos;

  // Obtener lista única de owners (usuario + organizaciones)
  const owners: { value: string; label: string; isUser: boolean }[] = [];
  if (username) {
    owners.push({ value: username, label: `${username} (tú)`, isUser: true });
  }
  orgs.forEach(org => {
    owners.push({ value: org.name, label: org.displayName || org.name, isUser: false });
  });

  function navigate() {
    if (!owner || !repoName) return;
    router.push(`/orgs/${owner}/repos/${repoName}/issues`);
  }

  const canNavigate = owner !== "" && repoName !== "";
  const isLoading = loadingOrgs || loadingRepos;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="issues-owner">Owner (usuario u organización)</Label>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Cargando...
          </div>
        ) : (
          <select
            id="issues-owner"
            value={owner}
            onChange={(e) => {
              setOwner(e.target.value);
              setRepoName("");
            }}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Selecciona owner</option>
            {username && (
              <optgroup label="Tu cuenta">
                <option value={username}>{username} (tú)</option>
              </optgroup>
            )}
            {orgs.length > 0 && (
              <optgroup label="Organizaciones">
                {orgs.map((org) => (
                  <option key={org.id} value={org.name}>
                    {org.displayName || org.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="issues-repo">Repositorio</Label>
        {loadingRepos ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Cargando...
          </div>
        ) : (
          <select
            id="issues-repo"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            disabled={!owner}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          >
            <option value="">
              {owner ? "Selecciona un repositorio" : "Primero selecciona owner"}
            </option>
            {filteredRepos.map((repo) => (
              <option key={repo.id} value={repo.name}>
                {repo.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={!canNavigate}
        onClick={navigate}
      >
        <CircleDot className="size-4" />
        Ver issues
      </Button>
    </div>
  );
}
