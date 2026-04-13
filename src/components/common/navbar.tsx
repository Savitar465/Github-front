import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
];

export function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="font-semibold tracking-tight">
          github-front
        </Link>
        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-zinc-950 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}


