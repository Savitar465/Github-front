"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function IssuesNavigator() {
  const [orgName, setOrgName] = useState("");
  const [repoName, setRepoName] = useState("");
  const router = useRouter();

  function navigate() {
    if (!orgName.trim() || !repoName.trim()) return;
    router.push(`/orgs/${orgName.trim()}/repos/${repoName.trim()}/issues`);
  }

  const canNavigate = orgName.trim() !== "" && repoName.trim() !== "";

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="issues-org">Organización (owner)</Label>
        <Input
          id="issues-org"
          placeholder="ej: mi-organizacion"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && navigate()}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="issues-repo">Repositorio</Label>
        <Input
          id="issues-repo"
          placeholder="ej: mi-repositorio"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && navigate()}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={!canNavigate}
        onClick={navigate}
      >
        <CircleDot className="size-4" />
        Ver issues
      </Button>
    </div>
  );
}
