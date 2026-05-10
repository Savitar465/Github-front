'use client';

import { useState } from 'react';
import { GitBranch, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BranchSelectorProps = {
  currentBranch: string;
  branches?: string[];
  onSelect?: (branch: string) => void;
};

export function BranchSelector({
  currentBranch,
  branches = ['main', 'develop'],
  onSelect,
}: BranchSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (branch: string) => {
    onSelect?.(branch);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <GitBranch className="h-4 w-4" />
        <span className="font-medium">{currentBranch}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 z-20 w-64 bg-background border rounded-lg shadow-lg overflow-hidden">
            <div className="p-2 border-b">
              <p className="text-xs font-medium text-muted-foreground">
                Cambiar branch
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => handleSelect(branch)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                >
                  <Check
                    className={`h-4 w-4 ${
                      branch === currentBranch ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span>{branch}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
