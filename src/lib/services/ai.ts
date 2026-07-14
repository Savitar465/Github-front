/**
 * Servicios de IA de Mini-GitHub (issue-classifier-ms y commit-summarizer-ms).
 *
 * Sigue el mismo patrón que issues.ts: en el navegador se usan rutas
 * relativas que el servidor Next.js reenvía vía rewrites (ver next.config.ts),
 * y el token JWT se toma de localStorage.
 */

const CLASSIFIER_BASE = "/ai-classifier";
const SUMMARIZER_BASE = "/ai-summarizer";

function getClientToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("github_clone_token") || "";
}

function authHeaders(): Record<string, string> {
  const token = getClientToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type ClassifyResult = {
  tipo: "bug" | "feature" | "question";
  severidad: "critica" | "alta" | "media" | "baja";
  confianza_tipo: number | null;
};

export async function classifyIssue(
  title: string,
  body?: string
): Promise<ClassifyResult> {
  const res = await fetch(`${CLASSIFIER_BASE}/v1/classify`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title, body: body || null }),
  });
  if (!res.ok) throw new Error(`Clasificador no disponible (${res.status})`);
  return res.json();
}

export async function summarizeDiff(diff: string): Promise<string> {
  const res = await fetch(`${SUMMARIZER_BASE}/v1/summarize`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ diff }),
  });
  if (!res.ok) throw new Error(`Resumidor no disponible (${res.status})`);
  const data = await res.json();
  return data.resumen;
}

/**
 * Construye un pseudo-diff en el formato del corpus de entrenamiento
 * (líneas añadidas con prefijo "+") a partir del contenido de un archivo
 * nuevo. Suficiente para el caso de uso de subir/crear archivos.
 */
export function buildDiffFromNewFile(fileName: string, content: string): string {
  const lineas = content.split("\n").slice(0, 60);
  return [`diff --git a/${fileName} b/${fileName}`, "new file",
          ...lineas.map((l) => `+ ${l}`)].join(" \n ");
}
