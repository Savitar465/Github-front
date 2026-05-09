'use client';

import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from 'next-themes';
import { Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type CodeViewerProps = {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
};

const languageMap: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  py: 'python',
  java: 'java',
  go: 'go',
  rs: 'rust',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  css: 'css',
  scss: 'scss',
  html: 'markup',
  xml: 'markup',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
};

function getLanguage(filename?: string): string {
  if (!filename) return 'plaintext';
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return languageMap[ext] || 'plaintext';
}

export function CodeViewer({ code, language, filename, showLineNumbers = true }: CodeViewerProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Esperar a que el componente esté montado para evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const lang = language || getLanguage(filename);
  // Usar tema consistente en servidor y cliente inicial, luego aplicar el tema real
  const theme = mounted && resolvedTheme === 'dark' ? themes.nightOwl : themes.github;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative border rounded-lg overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          className="bg-background/80 backdrop-blur-sm"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Highlight theme={theme} code={code.trimEnd()} language={lang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto p-4 text-sm`}
            style={{ ...style, margin: 0 }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell pr-4 text-right text-muted-foreground select-none opacity-50 text-xs">
                    {i + 1}
                  </span>
                )}
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
