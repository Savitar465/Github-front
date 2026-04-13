import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Auth
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Iniciar sesion
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Ejemplo minimo de una ruta dentro del grupo `(auth)`.
        </p>
      </header>

      <form className="space-y-4">
        <label className="block space-y-2 text-sm font-medium">
          <span>Correo</span>
          <input
            type="email"
            placeholder="tu@empresa.com"
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-white"
          />
        </label>

        <label className="block space-y-2 text-sm font-medium">
          <span>Contrasena</span>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-zinc-950 dark:border-zinc-700 dark:focus:border-white"
          />
        </label>

        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </section>
  );
}

