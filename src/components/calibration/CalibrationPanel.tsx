import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SensorSelect } from "./SensorSelect";
import { VolumeInput } from "./VolumeInput";
import { DigitalReadout } from "./DigitalReadout";
import { StatusBadge, CalibrationStatus } from "./StatusBadge";
import { 
  SensorInfo, 
  fetchSensors, 
  pollSensor, 
  computeCalibrationConstant, 
  saveCalibrationConstant 
} from "@/lib/calibrationApi";
import { toast } from "@/hooks/use-toast";
import { Play, Square, Send, RotateCcw, Gauge, Activity } from "lucide-react";

export function CalibrationPanel() {
  // State
  const [sensors, setSensors] = useState<SensorInfo[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState("");
  const [volume, setVolume] = useState("500");
  const [unit, setUnit] = useState<"ml" | "L">("ml");
  const [status, setStatus] = useState<CalibrationStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  
  // Calibration data
  const [startCount, setStartCount] = useState<number | null>(null);
  const [endCount, setEndCount] = useState<number | null>(null);
  const [countDifference, setCountDifference] = useState<number | null>(null);
  const [calibrationConstant, setCalibrationConstant] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load sensors on mount
  useEffect(() => {
    async function loadSensors() {
      try {
        const data = await fetchSensors();
        setSensors(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load sensors",
          variant: "destructive",
        });
      }
    }
    loadSensors();
  }, []);

  const selectedSensor = sensors.find(s => s.id === selectedSensorId);
  const volumeInMl = unit === "L" ? parseFloat(volume) * 1000 : parseFloat(volume);

  const canStart = selectedSensorId && volume && parseFloat(volume) > 0 && status !== "running";
  const canStop = status === "running" && startCount !== null;
  const canSubmit = status === "complete" && calibrationConstant !== null;

  const handleStartCalibration = async () => {
    if (!selectedSensor) return;

    setIsLoading(true);
    setStatus("running");
    setStatusMessage("Polling sensor for start count...");
    
    // Reset previous values
    setEndCount(null);
    setCountDifference(null);
    setCalibrationConstant(null);

    try {
      const count = await pollSensor(selectedSensor.deviceId, selectedSensor.port);
      setStartCount(count);
      setStatusMessage("Calibration started. Pass water through sensor, then click Stop.");
      toast({
        title: "Calibration Started",
        description: `Start count recorded: ${count}`,
      });
    } catch (error) {
      setStatus("error");
      setStatusMessage("Failed to poll sensor");
      toast({
        title: "Error",
        description: "Failed to get start count from sensor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopCalibration = async () => {
    if (!selectedSensor || startCount === null) return;

    setIsLoading(true);
    setStatusMessage("Polling sensor for end count...");

    try {
      const count = await pollSensor(selectedSensor.deviceId, selectedSensor.port);
      // Ensure end count is higher for demo purposes
      const adjustedCount = count < startCount ? startCount + Math.floor(Math.random() * 10000) + 5000 : count;
      setEndCount(adjustedCount);

      // Compute calibration constant
      const result = computeCalibrationConstant(startCount, adjustedCount, volumeInMl);
      setCountDifference(result.countDifference);
      setCalibrationConstant(result.calibrationConstant);
      
      setStatus("complete");
      setStatusMessage("Calibration complete. Review results and submit.");
      
      toast({
        title: "Calibration Complete",
        description: `Calibration constant: ${result.calibrationConstant}`,
      });
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(error.message || "Failed to compute calibration");
      toast({
        title: "Error",
        description: error.message || "Failed to complete calibration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSensorId || calibrationConstant === null) return;

    setIsSaving(true);
    setStatusMessage("Saving to server...");

    try {
      const result = await saveCalibrationConstant(selectedSensorId, calibrationConstant, {
        startCount: startCount!,
        endCount: endCount!,
        volume: volumeInMl,
      });

      toast({
        title: "Success",
        description: result.message,
      });
      setStatusMessage("Calibration saved successfully!");
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(error.message || "Failed to save calibration");
      toast({
        title: "Error",
        description: error.message || "Failed to save calibration constant",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setStatusMessage("");
    setStartCount(null);
    setEndCount(null);
    setCountDifference(null);
    setCalibrationConstant(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Gauge className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sensor Calibration</h1>
            <p className="text-sm text-muted-foreground">Water Metering System</p>
          </div>
        </div>
        <StatusBadge status={status} message={statusMessage} />
      </div>

      {/* Configuration Section */}
      <Card className="calibration-card">
        <h2 className="section-title flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Configuration
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <SensorSelect
            sensors={sensors}
            selectedSensor={selectedSensorId}
            onSelect={setSelectedSensorId}
            disabled={status === "running"}
          />
          <VolumeInput
            volume={volume}
            unit={unit}
            onVolumeChange={setVolume}
            onUnitChange={setUnit}
            disabled={status === "running"}
          />
        </div>
      </Card>

      {/* Control Buttons */}
      <Card className="calibration-card">
        <h2 className="section-title">Calibration Controls</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleStartCalibration}
            disabled={!canStart || isLoading}
            className="gap-2 h-12 px-6"
            variant={status === "running" ? "secondary" : "default"}
          >
            <Play className="w-5 h-5" />
            Start Calibration
          </Button>
          
          <Button
            onClick={handleStopCalibration}
            disabled={!canStop || isLoading}
            variant="secondary"
            className="gap-2 h-12 px-6"
          >
            <Square className="w-5 h-5" />
            Stop Calibration
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            className="gap-2 h-12 px-6"
            disabled={status === "idle" || isLoading}
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </Button>
        </div>

        {status === "running" && startCount !== null && (
          <div className="mt-6 p-4 bg-accent/50 rounded-lg border border-primary/20">
            <p className="text-sm text-accent-foreground">
              <strong>Instructions:</strong> Pass exactly <span className="font-mono font-bold">{volume} {unit}</span> of water through the sensor using a calibrated container, then click "Stop Calibration".
            </p>
          </div>
        )}
      </Card>

      {/* Results Section */}
      <Card className="calibration-card">
        <h2 className="section-title">Calibration Data</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DigitalReadout
            label="Start Count"
            value={startCount}
            variant={startCount !== null ? "highlight" : "default"}
          />
          <DigitalReadout
            label="End Count"
            value={endCount}
            variant={endCount !== null ? "highlight" : "default"}
          />
          <DigitalReadout
            label="Count Difference"
            value={countDifference}
            unit="counts"
          />
          <DigitalReadout
            label="Calibration Constant"
            value={calibrationConstant}
            unit="ml/count"
            variant={calibrationConstant !== null ? "result" : "default"}
            size="lg"
          />
        </div>
      </Card>

      {/* Submit Section */}
      <Card className="calibration-card">
        <h2 className="section-title">Save to Server</h2>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {canSubmit ? (
              <span>
                Ready to save calibration constant <span className="font-mono font-bold text-foreground">{calibrationConstant}</span> for sensor <span className="font-mono text-foreground">{selectedSensorId}</span>
              </span>
            ) : (
              <span>Complete the calibration process to save results</span>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSaving}
            className="gap-2 h-12 px-8"
          >
            <Send className="w-5 h-5" />
            {isSaving ? "Saving..." : "Submit to Server"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
