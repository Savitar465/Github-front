import { RepoHeader, BranchSelector, Breadcrumbs, CodeViewer } from '@/components/repo';
import { FileActions } from '@/components/repo/file-actions';
import { filesApi } from '@/lib/api';
import { buildPageTitle } from '@/lib/build-page-title';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ owner: string; repo: string; branch: string; path: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo, path } = await params;
  const filename = path[path.length - 1];
  return {
    title: buildPageTitle(`${filename} - ${owner}/${repo}`),
  };
}

// Mock file content
const mockFiles: Record<string, { content: string; size: number }> = {
  'README.md': {
    content: `# GitHub Clone

Este es un proyecto de ejemplo para la materia de Arquitectura en la Nube y Microservicios.

## Stack

- **Backend**: Java 21 + Spring Boot 3
- **Frontend**: Next.js 16 + React 19 + TypeScript
- **API Definition**: Smithy

## Estructura

\`\`\`
├── github-files-ms/    # Backend microservice
├── github-front/       # Frontend Next.js
└── docs/               # Documentation
\`\`\`

## Desarrollo Local

\`\`\`bash
# Backend
cd github-files-ms
./mvnw spring-boot:run

# Frontend
cd github-front
npm run dev
\`\`\`
`,
    size: 512,
  },
  'package.json': {
    content: `{
  "name": "github-front",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.2.3",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
}`,
    size: 298,
  },
  'tsconfig.json': {
    content: `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`,
    size: 389,
  },
  'index.ts': {
    content: `import { DefaultApi, Configuration } from './api';

const config = new Configuration({
  basePath: process.env.API_URL || 'http://localhost:8080',
});

export const api = new DefaultApi(config);

export async function getRepositoryContents(owner: string, repo: string) {
  const response = await api.getRepositoryContents({ owner, repo });
  return response.entries || [];
}

export async function getFileContent(owner: string, repo: string, path: string) {
  const response = await api.getFileContent({ owner, repo, filePath: path });
  return response.file;
}
`,
    size: 456,
  },
};

async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<{ content: string; size: number; sha: string } | null> {
  try {
    const response = await filesApi.getFileContent({
      owner,
      repo,
      filePath: path,
      ref: branch,
    });

    if (response.file?.content) {
      // Decodificar base64 (compatible con Node.js server-side)
      const content = Buffer.from(response.file.content, 'base64').toString('utf-8');
      return {
        content,
        size: response.file.size || 0,
        sha: response.file.sha,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching file:', error);
    // Mock data para desarrollo
    const filename = path.split('/').pop() || '';
    const mockFile = mockFiles[filename];
    if (mockFile) {
      return { ...mockFile, sha: 'mock-sha' };
    }
    return { content: '// File not found', size: 0, sha: 'mock-sha' };
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default async function BlobPage({ params }: PageProps) {
  const { owner, repo, branch, path } = await params;
  const pathString = path.join('/');
  const filename = path[path.length - 1];

  const file = await getFileContent(owner, repo, pathString, branch);
  const lineCount = file?.content.split('\n').length || 0;

  return (
    <div className="min-h-screen">
      <RepoHeader
        owner={owner}
        repo={repo}
        defaultBranch={branch}
        activeTab="code"
      />

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Branch selector and breadcrumbs */}
        <div className="flex items-center gap-4 mb-4">
          <BranchSelector currentBranch={branch} />
          <Breadcrumbs owner={owner} repo={repo} path={pathString} branch={branch} />
        </div>

        {/* File viewer */}
        <div className="border rounded-lg overflow-hidden">
          {/* File header */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">{filename}</span>
              <span className="text-muted-foreground">{lineCount} líneas</span>
              <span className="text-muted-foreground">{formatFileSize(file?.size || 0)}</span>
            </div>
            <FileActions
              owner={owner}
              repo={repo}
              branch={branch}
              path={pathString}
              sha={file?.sha || ''}
              content={file?.content || ''}
            />
          </div>

          {/* Code content */}
          {file && (
            <CodeViewer
              code={file.content}
              filename={filename}
              showLineNumbers={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
