"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateTeamPayload, TeamPermission } from "@/types/team";

const PERMISSIONS: { value: TeamPermission; label: string; description: string }[] = [
  { value: "read", label: "Read", description: "Solo puede leer código y abrir issues" },
  { value: "write", label: "Write", description: "Puede hacer push y gestionar issues y PRs" },
  { value: "admin", label: "Admin", description: "Acceso total al repositorio" },
];

type CreateTeamFormProps = {
  onSubmit: (payload: CreateTeamPayload) => Promise<void>;
  onCancel: () => void;
};

export function CreateTeamForm({ onSubmit, onCancel }: CreateTeamFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permission, setPermission] = useState<TeamPermission>("read");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        permission,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear equipo");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border bg-muted/20 p-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="team-name">Nombre del equipo</Label>
        <Input
          id="team-name"
          placeholder="ej: frontend-team"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="team-description">Descripción (opcional)</Label>
        <Input
          id="team-description"
          placeholder="Breve descripción del equipo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Permisos sobre repositorios</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          {PERMISSIONS.map((p) => (
            <label
              key={p.value}
              className={cn(
                "flex flex-1 cursor-pointer flex-col gap-0.5 rounded-lg border p-3 text-sm transition-colors",
                permission === p.value
                  ? "border-ring bg-muted"
                  : "border-border hover:bg-muted/50"
              )}
            >
              <input
                type="radio"
                name="permission"
                value={p.value}
                checked={permission === p.value}
                onChange={() => setPermission(p.value)}
                className="sr-only"
              />
              <span className="font-medium">{p.label}</span>
              <span className="text-xs text-muted-foreground">{p.description}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading ? "Creando..." : "Crear equipo"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
