import { cn } from "@/lib/utils";

const permissionConfig: Record<string, { label: string; className: string }> = {
  read: {
    label: "Read",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
  write: {
    label: "Write",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  admin: {
    label: "Admin",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

const fallback = {
  label: "Unknown",
  className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
};

export function PermissionBadge({ permission }: { permission: string }) {
  const { label, className } = permissionConfig[permission.toLowerCase()] ?? fallback;
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
