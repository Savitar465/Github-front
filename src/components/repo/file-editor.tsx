'use client';

import { useState, useCallback } from 'react';

import { buildDiffFromNewFile, summarizeDiff } from '@/lib/services/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Save, X, FileCode } from 'lucide-react';

type FileEditorProps = {
  initialContent?: string;
  initialFilename?: string;
  initialPath?: string;
  mode: 'create' | 'edit';
  owner: string;
  repo: string;
  branch: string;
  sha?: string; // Required for edit mode
  onSave: (data: {
    content: string;
    filename: string;
    path: string;
    message: string;
  }) => Promise<void>;
  onCancel: () => void;
};

export function FileEditor({
  initialContent = '',
  initialFilename = '',
  initialPath = '',
  mode,
  owner,
  repo,
  branch,
  sha,
  onSave,
  onCancel,
}: FileEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [filename, setFilename] = useState(initialFilename);
  const [path, setPath] = useState(initialPath);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Sugerencia de mensaje de commit vía commit-summarizer-ms (editable)
  const sugerirMensaje = useCallback(async () => {
    setAiLoading(true);
    setAiError('');
    try {
      const diff = buildDiffFromNewFile(filename.trim() || 'file', content);
      const resumen = await summarizeDiff(diff);
      if (resumen) setMessage(resumen);
      else setAiError('El modelo no produjo un resumen; escribe el mensaje manualmente.');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Servicio de IA no disponible');
    } finally {
      setAiLoading(false);
    }
  }, [content, filename]);

  const handleSubmit = useCallback(async () => {
    setError('');

    if (!filename.trim()) {
      setError('El nombre del archivo es requerido');
      return;
    }

    if (!message.trim()) {
      setError('El mensaje del commit es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        content,
        filename: filename.trim(),
        path: path.trim(),
        message: message.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el archivo');
    } finally {
      setIsSubmitting(false);
    }
  }, [content, filename, path, message, onSave]);

  const defaultMessage = mode === 'create'
    ? `Create ${filename || 'new file'}`
    : `Update ${filename}`;

  const fullPath = path ? `${path}/${filename}` : filename;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-5 w-5" />
          {mode === 'create' ? 'Crear archivo' : 'Editar archivo'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Filename and path */}
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
          <span className="text-muted-foreground">{owner}/{repo}/</span>
          {mode === 'create' ? (
            <>
              <Input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="carpeta (opcional)"
                className="h-8 w-40 font-mono text-sm"
              />
              <span className="text-muted-foreground">/</span>
              <Input
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="nombre.ext"
                className="h-8 flex-1 font-mono text-sm"
                autoFocus
              />
            </>
          ) : (
            <span className="font-medium">{fullPath || initialFilename}</span>
          )}
        </div>

        {/* Code editor */}
        <div className="space-y-2">
          <Label>Contenido</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="// Escribe el contenido del archivo aquí..."
            className="min-h-[400px] font-mono text-sm resize-y"
            spellCheck={false}
          />
          <p className="text-xs text-muted-foreground">
            {content.split('\n').length} líneas, {new Blob([content]).size} bytes
          </p>
        </div>

        {/* Commit message */}
        <div className="space-y-2">
          <Label htmlFor="commit-message">Mensaje del commit</Label>
          <div className="flex gap-2">
            <Input
              id="commit-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={defaultMessage}
            />
            <Button
              type="button"
              variant="outline"
              onClick={sugerirMensaje}
              disabled={aiLoading || !content.trim() || !filename.trim()}
              title="Genera un mensaje a partir de los cambios usando el modelo de IA"
            >
              {aiLoading ? 'Generando...' : '✨ Sugerir mensaje'}
            </Button>
          </div>
          {aiError && <p className="text-xs text-destructive">{aiError}</p>}
          <p className="text-xs text-muted-foreground">
            Branch: <span className="font-mono">{branch}</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear archivo' : 'Guardar cambios'}
        </Button>
      </CardFooter>
    </Card>
  );
}
