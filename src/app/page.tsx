import Link from "next/link";
import { PageContainer } from "@/components/common/page-container";

const quickStart = [
  "Edita src/app/page.tsx para personalizar tu portada.",
  "Crea features en src/app/<feature>/ con _components privados.",
  "Manten componentes globales en src/components y logica compartida en src/lib.",
];

export default function Home() {
  return (
    <PageContainer
      title="Bienvenido a github-front"
      description="Template de inicio con App Router, ruta real /dashboard y estructura por features en src/."
    >
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Frontend base
        </p>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Esta home muestra la base del proyecto con carpetas globales para UI,
          hooks, tipos, utilidades y una feature real para dashboard.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold">Checklist de inicio</h2>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          {quickStart.map((item) => (
            <li key={item} className="list-inside list-disc">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard"
          className="rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
        >
          <h3 className="font-semibold">Dashboard</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Ruta real por feature con _components privados y servicios compartidos.
          </p>
        </Link>

        <a
          href="https://nextjs.org/docs/app"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
        >
          <h3 className="font-semibold">Docs Next.js</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Referencia oficial para App Router.
          </p>
        </a>

        <article className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="font-semibold">Documentacion local</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Revisa `docs/README.md`, `docs/estructura-del-proyecto.md` y
            `docs/contribucion.md` para el onboarding del equipo.
          </p>
        </article>
      </section>
    </PageContainer>
  );
}
