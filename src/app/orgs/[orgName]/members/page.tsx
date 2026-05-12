'use client';

import { useEffect, useState, useCallback, use } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { getOrgMembers } from "@/lib/services/org-members";
import { MembersManager } from "./_components/members-manager";
import type { OrgMember } from '@/types/org-member';
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

type Props = {
  params: Promise<{ orgName: string }>;
};

export default function OrgMembersPage({ params }: Props) {
  const { orgName } = use(params);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getOrgMembers(orgName);
      setMembers(data);
    } catch (err) {
      console.error("[MembersPage] Error:", err);
      setFetchError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, [orgName]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      setFetchError("Debes iniciar sesión para ver los colaboradores.");
      return;
    }

    loadMembers();
  }, [authLoading, isAuthenticated, loadMembers]);

  if (authLoading || loading) {
    return (
      <PageContainer
        title="Colaboradores"
        description={`Gestiona quién tiene acceso a ${orgName} y con qué permisos.`}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Colaboradores"
      description={`Gestiona quién tiene acceso a ${orgName} y con qué permisos.`}
    >
      {fetchError ? (
        <EmptyState title="Error al cargar" message={fetchError} />
      ) : (
        <MembersManager orgName={orgName} initialMembers={members} />
      )}
    </PageContainer>
  );
}
