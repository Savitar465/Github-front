import { render, screen } from '@testing-library/react';
import { FileTree } from '@/components/repo/file-tree';
import type { DirectoryEntryDTO } from '@/lib/api';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('FileTree', () => {
  const mockEntries: DirectoryEntryDTO[] = [
    { name: 'src', path: 'src', sha: '1', type: 'dir' },
    { name: 'README.md', path: 'README.md', sha: '2', type: 'file', size: 1024 },
    { name: 'package.json', path: 'package.json', sha: '3', type: 'file', size: 512 },
  ];

  it('renders file entries correctly', () => {
    render(
      <FileTree
        entries={mockEntries}
        owner="test-owner"
        repo="test-repo"
        branch="main"
      />
    );

    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('README.md')).toBeInTheDocument();
    expect(screen.getByText('package.json')).toBeInTheDocument();
  });

  it('sorts directories before files', () => {
    render(
      <FileTree
        entries={mockEntries}
        owner="test-owner"
        repo="test-repo"
        branch="main"
      />
    );

    const links = screen.getAllByRole('link');
    // First rendered link should be the directory (src)
    expect(links[0]).toHaveTextContent('src');
  });

  it('generates correct links for files and directories', () => {
    render(
      <FileTree
        entries={mockEntries}
        owner="test-owner"
        repo="test-repo"
        branch="main"
      />
    );

    // Directory link
    const srcLink = screen.getByText('src').closest('a');
    expect(srcLink).toHaveAttribute('href', '/test-owner/test-repo/tree/main/src');

    // File link
    const readmeLink = screen.getByText('README.md').closest('a');
    expect(readmeLink).toHaveAttribute('href', '/test-owner/test-repo/blob/main/README.md');
  });

  it('displays file sizes for files', () => {
    render(
      <FileTree
        entries={mockEntries}
        owner="test-owner"
        repo="test-repo"
        branch="main"
      />
    );

    expect(screen.getByText('1 KB')).toBeInTheDocument();
    expect(screen.getByText('512 B')).toBeInTheDocument();
  });

  it('handles empty entries', () => {
    render(
      <FileTree
        entries={[]}
        owner="test-owner"
        repo="test-repo"
        branch="main"
      />
    );

    // Should render without crashing
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
