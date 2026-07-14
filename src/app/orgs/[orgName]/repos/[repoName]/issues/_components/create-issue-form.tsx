"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classifyIssue, type ClassifyResult } from "@/lib/services/ai";
import { createLabel, listLabels } from "@/lib/services/issues";
import type { CreateIssuePayload, LabelDTO } from "@/types/issue";

// Colores de las labels generadas por la IA (tipo:* y severidad:*)
const AI_LABEL_COLORS: Record<string, string> = {
  "tipo:bug": "#d73a4a",
  "tipo:feature": "#0e8a16",
  "tipo:question": "#a371f7",
  "severidad:critica": "#b60205",
  "severidad:alta": "#ff9500",
  "severidad:media": "#fbca04",
  "severidad:baja": "#0075ca",
};

type CreateIssueFormProps = {
  orgName: string;
  repoName: string;
  onSubmit: (payload: CreateIssuePayload) => Promise<void>;
  onCancel: () => void;
};

export function CreateIssueForm({
  orgName,
  repoName,
  onSubmit,
  onCancel,
}: CreateIssueFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [assignee, setAssignee] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [availableLabels, setAvailableLabels] = useState<LabelDTO[]>([]);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<ClassifyResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    listLabels(orgName, repoName)
      .then((data) => setAvailableLabels(data.labels))
      .catch(() => {});
  }, [orgName, repoName]);

  function toggleLabel(name: string) {
    setSelectedLabels((prev) =>
      prev.includes(name) ? prev.filter((l) => l !== name) : [...prev, name]
    );
  }

  async function sugerirConIA() {
    if (!title.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      setAiResult(await classifyIssue(title.trim(), body.trim() || undefined));
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Servicio de IA no disponible");
    } finally {
      setAiLoading(false);
    }
  }

  // issues-ms ignora labels inexistentes al crear el issue, por eso la label
  // sugerida se crea primero si no existe en el repositorio.
  async function asegurarLabel(name: string) {
    if (availableLabels.some((l) => l.name === name)) return;
    try {
      const nueva = await createLabel(orgName, repoName, {
        name,
        color: AI_LABEL_COLORS[name] ?? "#8b949e",
        description: "Sugerida por IA",
      });
      setAvailableLabels((prev) => [...prev, nueva]);
    } catch {
      // si ya existía (409) o falla, se continúa: la label puede existir igual
    }
  }

  async function aplicarSugerencia() {
    if (!aiResult) return;
    const nombres = [`tipo:${aiResult.tipo}`, `severidad:${aiResult.severidad}`];
    for (const nombre of nombres) {
      await asegurarLabel(nombre);
    }
    setSelectedLabels((prev) => [
      ...prev.filter((l) => !l.startsWith("tipo:") && !l.startsWith("severidad:")),
      ...nombres,
    ]);
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        body: body.trim() || undefined,
        assignee: assignee.trim() || undefined,
        labels: selectedLabels.length > 0 ? selectedLabels : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create issue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-lg border border-border p-4 lg:flex-row"
    >
      {/* Left: main fields */}
      <div className="min-w-0 flex-1 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="issue-title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="issue-title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="issue-body">Description</Label>
          <div className="overflow-hidden rounded-lg border border-input focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
            <div className="flex border-b border-border bg-muted/20 px-1 pt-1">
              <span className="border-b-2 border-primary px-3 py-1 text-xs font-medium text-foreground">
                Write
              </span>
              <span className="px-3 py-1 text-xs text-muted-foreground">Preview</span>
            </div>
            <textarea
              id="issue-body"
              placeholder="Describe the issue in detail. Include steps to reproduce, expected behavior, and actual behavior."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={loading}
              rows={8}
              className="w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <div className="flex items-center gap-3 border-t border-border bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="cursor-default font-bold">B</span>
              <span className="cursor-default italic">I</span>
              <span className="cursor-default font-mono">{"<>"}</span>
              <span className="cursor-default">🔗</span>
              <span className="cursor-default">≡</span>
              <span className="ml-auto">Markdown supported</span>
            </div>
          </div>
        </div>

        {/* Sugerencia de clasificación por IA */}
        <div className="rounded-lg border border-border bg-muted/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ✨ Clasificación asistida por IA
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={sugerirConIA}
              disabled={aiLoading || !title.trim()}
            >
              {aiLoading ? "Analizando..." : "Sugerir tipo y severidad"}
            </Button>
          </div>

          {aiError && <p className="mt-2 text-xs text-destructive">{aiError}</p>}

          {aiResult && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `${AI_LABEL_COLORS[`tipo:${aiResult.tipo}`]}33`,
                  color: AI_LABEL_COLORS[`tipo:${aiResult.tipo}`],
                }}
              >
                tipo: {aiResult.tipo}
                {aiResult.confianza_tipo != null &&
                  ` (${Math.round(aiResult.confianza_tipo * 100)}%)`}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `${AI_LABEL_COLORS[`severidad:${aiResult.severidad}`]}33`,
                  color: AI_LABEL_COLORS[`severidad:${aiResult.severidad}`],
                }}
              >
                severidad: {aiResult.severidad}
              </span>
              <Button type="button" size="sm" variant="secondary" onClick={aplicarSugerencia}>
                Aplicar como labels
              </Button>
              <span className="text-[10px] text-muted-foreground">
                La sugerencia es editable: puedes quitar o cambiar las labels.
              </span>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading || !title.trim()}>
            {loading ? "Submitting..." : "Submit new issue"}
          </Button>
        </div>
      </div>

      {/* Right: sidebar */}
      <aside className="shrink-0 lg:w-56">
        {/* Assignees */}
        <div className="border-b border-border py-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Assignees
          </h3>
          <Input
            placeholder="Assign someone"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            disabled={loading}
            className="h-8 text-xs"
          />
        </div>

        {/* Labels */}
        <div className="border-b border-border py-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
            onClick={() => setLabelsOpen((v) => !v)}
          >
            <span>Labels</span>
            <span className="text-[10px]">{labelsOpen ? "▲" : "▼"}</span>
          </button>

          {selectedLabels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedLabels.map((name) => {
                const label = availableLabels.find((l) => l.name === name);
                return label ? (
                  <span
                    key={name}
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${label.color}33`,
                      color: label.color,
                      border: `1px solid ${label.color}66`,
                    }}
                  >
                    {label.name}
                  </span>
                ) : (
                  <span key={name} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {name}
                  </span>
                );
              })}
            </div>
          )}

          {!labelsOpen && selectedLabels.length === 0 && (
            <p className="mt-1 text-xs text-muted-foreground">None yet</p>
          )}

          {labelsOpen && (
            <div className="mt-2 space-y-0.5">
              {availableLabels.length === 0 ? (
                <p className="text-xs text-muted-foreground">No labels available</p>
              ) : (
                availableLabels.map((label) => (
                  <label
                    key={label.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLabels.includes(label.name)}
                      onChange={() => toggleLabel(label.name)}
                      className="size-3 accent-primary"
                    />
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-xs">{label.name}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* Helpful tips */}
        <div className="py-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Helpful Tips
          </h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Include steps to reproduce the issue</li>
            <li>• Describe expected vs actual behavior</li>
            <li>• Attach relevant logs or screenshots</li>
          </ul>
        </div>
      </aside>
    </form>
  );
}
