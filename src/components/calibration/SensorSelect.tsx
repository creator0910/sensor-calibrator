import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SensorInfo } from "@/lib/calibrationApi";
import { Cpu } from "lucide-react";

interface SensorSelectProps {
  sensors: SensorInfo[];
  selectedSensor: string;
  onSelect: (sensorId: string) => void;
  disabled?: boolean;
}

export function SensorSelect({ sensors, selectedSensor, onSelect, disabled }: SensorSelectProps) {
  // Group sensors by device
  const groupedSensors = sensors.reduce((acc, sensor) => {
    if (!acc[sensor.deviceId]) {
      acc[sensor.deviceId] = [];
    }
    acc[sensor.deviceId].push(sensor);
    return acc;
  }, {} as Record<string, SensorInfo[]>);

  return (
    <div className="space-y-2">
      <label className="input-label flex items-center gap-2">
        <Cpu className="w-4 h-4 text-primary" />
        Select Sensor
      </label>
      <Select value={selectedSensor} onValueChange={onSelect} disabled={disabled}>
        <SelectTrigger className="w-full h-12 bg-card">
          <SelectValue placeholder="Choose a sensor..." />
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50">
          {Object.entries(groupedSensors).map(([deviceId, deviceSensors]) => (
            <div key={deviceId}>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {deviceId}
              </div>
              {deviceSensors.map((sensor) => (
                <SelectItem 
                  key={sensor.id} 
                  value={sensor.id}
                  className="cursor-pointer"
                >
                  <span className="font-mono text-sm">Port {sensor.port}</span>
                  <span className="text-muted-foreground ml-2 text-xs">({sensor.id})</span>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
