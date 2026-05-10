import { File, Folder, FileCode, FileText, FileJson, FileImage, FileCog } from 'lucide-react';

type FileIconProps = {
  name: string;
  type: 'file' | 'dir';
  className?: string;
};

const extensionIcons: Record<string, typeof File> = {
  ts: FileCode,
  tsx: FileCode,
  js: FileCode,
  jsx: FileCode,
  py: FileCode,
  java: FileCode,
  go: FileCode,
  rs: FileCode,
  cpp: FileCode,
  c: FileCode,
  json: FileJson,
  yaml: FileCog,
  yml: FileCog,
  toml: FileCog,
  md: FileText,
  txt: FileText,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  gif: FileImage,
  svg: FileImage,
  ico: FileImage,
};

export function FileIcon({ name, type, className = 'h-4 w-4' }: FileIconProps) {
  if (type === 'dir') {
    return <Folder className={`${className} text-blue-500`} />;
  }

  const ext = name.split('.').pop()?.toLowerCase() || '';
  const Icon = extensionIcons[ext] || File;

  return <Icon className={`${className} text-muted-foreground`} />;
}
