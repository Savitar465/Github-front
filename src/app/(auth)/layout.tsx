import type { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-6 py-12 sm:px-10">
      <div className="w-full">{children}</div>
    </main>
  );
}

