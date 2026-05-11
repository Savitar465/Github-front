"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateOrganizationPayload, OrgVisibility } from "@/types/organization";

type CreateOrgFormProps = {
  onSubmit: (payload: CreateOrganizationPayload) => Promise<void>;
  onCancel: () => void;
};

export function CreateOrgForm({ onSubmit, onCancel }: CreateOrgFormProps) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<OrgVisibility>("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !displayName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        displayName: displayName.trim(),
        description: description.trim() || undefined,
        visibility,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear organización");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border bg-muted/20 p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="org-name">Nombre único (URL)</Label>
          <Input
            id="org-name"
            placeholder="ej: mi-empresa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">Solo letras, números y guiones. Min. 3 caracteres.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="org-display-name">Nombre para mostrar</Label>
          <Input
            id="org-display-name"
            placeholder="ej: Mi Empresa S.A."
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="org-description">Descripción (opcional)</Label>
        <Input
          id="org-description"
          placeholder="Breve descripción de la organización"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Visibilidad</Label>
        <div className="flex gap-2">
          {(["public", "private"] as OrgVisibility[]).map((v) => (
            <label
              key={v}
              className={cn(
                "flex flex-1 cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                visibility === v ? "border-ring bg-muted" : "border-border hover:bg-muted/50"
              )}
            >
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={visibility === v}
                onChange={() => setVisibility(v)}
                className="sr-only"
              />
              <span className="font-medium capitalize">{v === "public" ? "Pública" : "Privada"}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !name.trim() || !displayName.trim()}>
          {loading ? "Creando..." : "Crear organización"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
