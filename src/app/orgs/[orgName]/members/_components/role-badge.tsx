import { cn } from "@/lib/utils";

type RoleBadgeProps = {
  role: string;
};

const roleConfig: Record<string, { label: string; className: string }> = {
  owner: {
    label: "Owner",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  developer: {
    label: "Developer",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  reporter: {
    label: "Reporter",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
  member: {
    label: "Member",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
};

const fallback = {
  label: "Unknown",
  className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const normalized = role.toLowerCase();
  const { label, className } = roleConfig[normalized] ?? fallback;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}
