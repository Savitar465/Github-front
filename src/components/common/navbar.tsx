'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { LogOut, Book, Menu, X, Users } from 'lucide-react';
import { GithubIcon } from '@/components/icons/github-icon';
import { useState } from 'react';

const publicLinks = [
  { href: '/repos', label: 'Repositorios', icon: Book },
  { href: '/users', label: 'Usuarios', icon: Users },
];

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <GithubIcon className="h-6 w-6" />
          <span className="hidden sm:inline">GitHubX</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button key={link.href} asChild variant="ghost" size="sm">
                <Link href={link.href} className="gap-2">
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            );
          })}
        </div>

        {/* User section */}
        <div className="flex items-center gap-2">
          {!isLoading && (
            <>
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2 text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Salir</span>
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              )}
            </>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="px-4 py-3 space-y-2">
            {publicLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
