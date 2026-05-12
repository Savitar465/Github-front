'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RepoHeader, Breadcrumbs, BranchSelector } from '@/components/repo';
import { FileEditor } from '@/components/repo/file-editor';
import { getFileContent, uploadFile } from '@/lib/api/repository-api';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function EditFilePage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, token } = useAuth();

  const owner = params.owner as string;
  const repo = params.repo as string;
  const branch = params.branch as string;
  const pathSegments = params.path as string[];
  const filePath = pathSegments?.join('/') || '';
  const filename = pathSegments?.[pathSegments.length - 1] || '';
  const parentPath = pathSegments?.slice(0, -1).join('/') || '';

  const [initialContent, setInitialContent] = useState<string>('');
  const [sha, setSha] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadFile() {
      try {
        const response = await getFileContent(owner, repo, filePath, undefined, branch);

        if (response.file?.content) {
          // Decodificar base64
          const content = decodeURIComponent(escape(atob(response.file.content)));
          setInitialContent(content);
          setSha(response.file.sha);
        }
      } catch (err) {
        console.error('Error loading file:', err);
        setError('No se pudo cargar el archivo');
      } finally {
        setLoading(false);
      }
    }

    loadFile();
  }, [owner, repo, filePath, branch]);

  const handleSave = async (data: {
    content: string;
    filename: string;
    path: string;
    message: string;
  }) => {
    if (!token) {
      setError('No autenticado');
      return;
    }

    // Codificar contenido a base64
    const contentBase64 = btoa(unescape(encodeURIComponent(data.content)));

    await uploadFile(owner, repo, filePath, token, {
      content: contentBase64,
      message: data.message,
      branch,
    });

    // Navegar al archivo
    router.push(`/${owner}/${repo}/blob/${branch}/${filePath}`);
  };

  const handleCancel = () => {
    router.push(`/${owner}/${repo}/blob/${branch}/${filePath}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <RepoHeader owner={owner} repo={repo} defaultBranch={branch} activeTab="code" />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Autenticación requerida</h2>
          <p className="text-muted-foreground">
            Debes iniciar sesión para editar archivos.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <RepoHeader owner={owner} repo={repo} defaultBranch={branch} activeTab="code" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <RepoHeader owner={owner} repo={repo} defaultBranch={branch} activeTab="code" />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h2 className="text-xl font-semibold mb-2 text-destructive">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <RepoHeader owner={owner} repo={repo} defaultBranch={branch} activeTab="code" />

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <BranchSelector currentBranch={branch} />
          <Breadcrumbs owner={owner} repo={repo} path={filePath} branch={branch} />
        </div>

        <FileEditor
          mode="edit"
          owner={owner}
          repo={repo}
          branch={branch}
          sha={sha}
          initialContent={initialContent}
          initialFilename={filename}
          initialPath={parentPath}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
