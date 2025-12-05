import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets } from "lucide-react";

interface VolumeInputProps {
  volume: string;
  unit: "ml" | "L";
  onVolumeChange: (value: string) => void;
  onUnitChange: (unit: "ml" | "L") => void;
  disabled?: boolean;
}

export function VolumeInput({ volume, unit, onVolumeChange, onUnitChange, disabled }: VolumeInputProps) {
  return (
    <div className="space-y-2">
      <label className="input-label flex items-center gap-2">
        <Droplets className="w-4 h-4 text-primary" />
        Calibration Volume
      </label>
      <div className="flex gap-2">
        <Input
          type="number"
          value={volume}
          onChange={(e) => onVolumeChange(e.target.value)}
          placeholder="Enter volume..."
          className="flex-1 h-12 text-lg font-mono bg-card"
          min="0"
          step="0.1"
          disabled={disabled}
        />
        <Select value={unit} onValueChange={(v) => onUnitChange(v as "ml" | "L")} disabled={disabled}>
          <SelectTrigger className="w-24 h-12 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            <SelectItem value="ml">ml</SelectItem>
            <SelectItem value="L">L</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-muted-foreground">
        Enter the exact volume of water you will pass through the sensor
      </p>
    </div>
  );
}
