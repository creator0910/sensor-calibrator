import { cn } from "@/lib/utils";

interface DigitalReadoutProps {
  label: string;
  value: number | string | null;
  unit?: string;
  variant?: "default" | "highlight" | "result";
  size?: "sm" | "md" | "lg";
}

export function DigitalReadout({ label, value, unit, variant = "default", size = "md" }: DigitalReadoutProps) {
  const sizeClasses = {
    sm: "text-lg py-2 px-3",
    md: "text-2xl py-3 px-4",
    lg: "text-3xl py-4 px-5",
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div
        className={cn(
          "digital-display rounded-lg flex items-center justify-between",
          sizeClasses[size],
          variant === "highlight" && "border-primary/50",
          variant === "result" && "border-success/50 text-success"
        )}
        style={{
          textShadow: variant === "result" 
            ? "0 0 10px hsl(142 70% 45% / 0.5)" 
            : variant === "highlight"
            ? "0 0 10px hsl(187 80% 42% / 0.5)"
            : "0 0 10px hsl(142 100% 60% / 0.5)",
        }}
      >
        <span className={cn(
          "font-mono font-semibold",
          value === null && "text-display-muted opacity-50"
        )}>
          {value !== null ? value : "---"}
        </span>
        {unit && (
          <span className="text-display-muted text-sm ml-2">{unit}</span>
        )}
      </div>
    </div>
  );
}
