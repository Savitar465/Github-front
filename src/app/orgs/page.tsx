'use client';

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { getMyOrganizations } from "@/lib/services/organizations";
import type { OrganizationDTO } from '@/types/organization';
import { OrgsManager } from "./_components/orgs-manager";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function OrgsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orgs, setOrgs] = useState<OrganizationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      setFetchError("Debes iniciar sesión para ver tus organizaciones.");
      return;
    }

    async function loadOrgs() {
      try {
        const data = await getMyOrganizations();
        setOrgs(data);
      } catch (err) {
        console.error("[OrgsPage] Error:", err);
        setFetchError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }

    loadOrgs();
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) {
    return (
      <PageContainer
        title="Organizaciones"
        description="Tus organizaciones y sus equipos y colaboradores."
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Organizaciones"
      description="Tus organizaciones y sus equipos y colaboradores."
    >
      {fetchError ? (
        <EmptyState title="Error al cargar" message={fetchError} />
      ) : (
        <OrgsManager initialOrgs={orgs} />
      )}
    </PageContainer>
  );
}
