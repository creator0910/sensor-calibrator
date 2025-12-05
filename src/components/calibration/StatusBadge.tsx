import { cn } from "@/lib/utils";
import { Circle, Loader2, CheckCircle2, XCircle } from "lucide-react";

export type CalibrationStatus = "idle" | "ready" | "running" | "complete" | "error";

interface StatusBadgeProps {
  status: CalibrationStatus;
  message?: string;
}

const statusConfig: Record<CalibrationStatus, {
  label: string;
  icon: React.ElementType;
  className: string;
}> = {
  idle: {
    label: "Idle",
    icon: Circle,
    className: "status-idle",
  },
  ready: {
    label: "Ready",
    icon: Circle,
    className: "bg-primary/15 text-primary",
  },
  running: {
    label: "Calibrating",
    icon: Loader2,
    className: "status-active",
  },
  complete: {
    label: "Complete",
    icon: CheckCircle2,
    className: "status-complete",
  },
  error: {
    label: "Error",
    icon: XCircle,
    className: "status-error",
  },
};

export function StatusBadge({ status, message }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <span className={cn("status-badge", config.className)}>
        <Icon className={cn("w-4 h-4", status === "running" && "animate-spin")} />
        {config.label}
      </span>
      {message && (
        <span className="text-sm text-muted-foreground">{message}</span>
      )}
    </div>
  );
}
