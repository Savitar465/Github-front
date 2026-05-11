"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OrgNavigator() {
  const [orgName, setOrgName] = useState("");
  const router = useRouter();

  function navigate(section: "members" | "teams") {
    if (!orgName.trim()) return;
    router.push(`/orgs/${orgName.trim()}/${section}`);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="org-name">Nombre de la organización</Label>
        <Input
          id="org-name"
          placeholder="ej: mi-organizacion"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && navigate("teams")}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!orgName.trim()}
          onClick={() => navigate("teams")}
        >
          <UsersRound className="size-4" />
          Ver equipos
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!orgName.trim()}
          onClick={() => navigate("members")}
        >
          <Users className="size-4" />
          Ver colaboradores
        </Button>
      </div>
    </div>
  );
}
