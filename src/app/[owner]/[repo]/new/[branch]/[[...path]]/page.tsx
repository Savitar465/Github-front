'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { RepoHeader, Breadcrumbs, BranchSelector } from '@/components/repo';
import { FileEditor } from '@/components/repo/file-editor';
import { uploadFile } from '@/lib/api/repository-api';
import { useAuth } from '@/lib/auth';

export default function NewFilePage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, token } = useAuth();

  const owner = params.owner as string;
  const repo = params.repo as string;
  const branch = params.branch as string;
  const pathSegments = params.path as string[] | undefined;
  const currentPath = pathSegments?.join('/') || '';

  const handleSave = async (data: {
    content: string;
    filename: string;
    path: string;
    message: string;
  }) => {
    if (!token) {
      throw new Error('No autenticado');
    }

    const fullPath = data.path ? `${data.path}/${data.filename}` : data.filename;

    // Codificar contenido a base64
    const contentBase64 = btoa(unescape(encodeURIComponent(data.content)));

    console.log('[NewFile] Uploading file:', { owner, repo, fullPath, branch });
    console.log('[NewFile] Token present:', !!token);

    try {
      const result = await uploadFile(owner, repo, fullPath, token, {
        content: contentBase64,
        message: data.message,
        branch,
      });
      console.log('[NewFile] Upload success:', result);
      // Navegar al archivo creado
      router.push(`/${owner}/${repo}/blob/${branch}/${fullPath}`);
    } catch (err) {
      console.error('[NewFile] Upload error:', err);
      throw err;
    }
  };

  const handleCancel = () => {
    if (currentPath) {
      router.push(`/${owner}/${repo}/tree/${branch}/${currentPath}`);
    } else {
      router.push(`/${owner}/${repo}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <RepoHeader owner={owner} repo={repo} defaultBranch={branch} activeTab="code" />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Autenticación requerida</h2>
          <p className="text-muted-foreground">
            Debes iniciar sesión para crear archivos.
          </p>
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
          <Breadcrumbs owner={owner} repo={repo} path={currentPath} branch={branch} />
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">Nuevo archivo</span>
        </div>

        <FileEditor
          mode="create"
          owner={owner}
          repo={repo}
          branch={branch}
          initialPath={currentPath}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
