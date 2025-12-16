import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ==========================================
// MOCK DATA - Replace with real API later
// ==========================================

// List of sensors (hardcoded for now)
const SENSORS = [
  { id: "Device_001_Sensor_1", label: "Device 001 - Sensor 1" },
  { id: "Device_001_Sensor_2", label: "Device 001 - Sensor 2" },
  { id: "Device_001_Sensor_3", label: "Device 001 - Sensor 3" },
  { id: "Device_001_Sensor_4", label: "Device 001 - Sensor 4" },
  { id: "Device_002_Sensor_1", label: "Device 002 - Sensor 1" },
  { id: "Device_002_Sensor_2", label: "Device 002 - Sensor 2" },
];

// Mock function: Simulates getting count from sensor
// TODO: Replace with real API call to Raspberry Pi
async function pollSensor(): Promise<number> {
  await new Promise((r) => setTimeout(r, 1000)); // Fake delay
  return Math.floor(Math.random() * 50000) + 10000; // Random number
}

// Mock function: Saves calibration to server
// TODO: Replace with real API call
async function saveToServer(sensorId: string, constant: number): Promise<void> {
  await new Promise((r) => setTimeout(r, 1000)); // Fake delay
  console.log("Saved to server:", { sensorId, calibrationConstant: constant });
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function SimpleCalibrationPanel() {
  // ----- USER INPUT STATE -----
  const [selectedSensor, setSelectedSensor] = useState("");
  const [volume, setVolume] = useState("500"); // Volume in ml

  // ----- CALIBRATION STATE -----
  const [isRunning, setIsRunning] = useState(false);
  const [startCount, setStartCount] = useState<number | null>(null);
  const [endCount, setEndCount] = useState<number | null>(null);

  // ----- COMPUTED VALUES -----
  // Calculate difference between end and start counts
  const countDifference =
    startCount !== null && endCount !== null ? endCount - startCount : null;

  // Calculate calibration constant: Volume / CountDifference
  const calibrationConstant =
    countDifference !== null && countDifference > 0
      ? Number((parseFloat(volume) / countDifference).toFixed(5))
      : null;

  // ----- STATUS STATE -----
  const [status, setStatus] = useState("Ready to start");
  const [isSaving, setIsSaving] = useState(false);

  // ==========================================
  // BUTTON HANDLERS
  // ==========================================

  // Start calibration: Get the starting count from sensor
  async function handleStart() {
    if (!selectedSensor || !volume) {
      alert("Please select a sensor and enter volume first");
      return;
    }

    setStatus("Getting start count...");
    setIsRunning(true);
    setEndCount(null); // Reset end count

    const count = await pollSensor();
    setStartCount(count);
    setStatus("Calibration running. Pass water through sensor, then click STOP.");
  }

  // Stop calibration: Get the ending count and calculate result
  async function handleStop() {
    setStatus("Getting end count...");

    let count = await pollSensor();

    // Make sure end count is higher than start (for demo purposes)
    if (startCount !== null && count <= startCount) {
      count = startCount + Math.floor(Math.random() * 10000) + 1000;
    }

    setEndCount(count);
    setIsRunning(false);
    setStatus("Calibration complete! Review results and submit.");
  }

  // Reset everything
  function handleReset() {
    setStartCount(null);
    setEndCount(null);
    setIsRunning(false);
    setStatus("Ready to start");
  }

  // Save to server
  async function handleSubmit() {
    if (!calibrationConstant) return;

    setIsSaving(true);
    setStatus("Saving to server...");

    try {
      await saveToServer(selectedSensor, calibrationConstant);
      setStatus("✓ Saved successfully!");
    } catch (error) {
      setStatus("✗ Failed to save. Try again.");
    }

    setIsSaving(false);
  }

  // ==========================================
  // UI RENDER
  // ==========================================

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center">Sensor Calibration</h1>

      {/* Status Message */}
      <div className="p-3 bg-muted rounded text-center text-sm">{status}</div>

      {/* Step 1: Select Sensor */}
      <div className="space-y-2">
        <Label>1. Select Sensor</Label>
        <Select
          value={selectedSensor}
          onValueChange={setSelectedSensor}
          disabled={isRunning}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a sensor..." />
          </SelectTrigger>
          <SelectContent>
            {SENSORS.map((sensor) => (
              <SelectItem key={sensor.id} value={sensor.id}>
                {sensor.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Step 2: Enter Volume */}
      <div className="space-y-2">
        <Label>2. Enter Calibration Volume (ml)</Label>
        <Input
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          placeholder="e.g., 500"
          disabled={isRunning}
        />
      </div>

      {/* Step 3: Start/Stop Buttons */}
      <div className="space-y-2">
        <Label>3. Run Calibration</Label>
        <div className="flex gap-2">
          <Button
            onClick={handleStart}
            disabled={isRunning || !selectedSensor || !volume}
            className="flex-1"
          >
            START
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isRunning}
            variant="secondary"
            className="flex-1"
          >
            STOP
          </Button>
          <Button onClick={handleReset} variant="outline">
            RESET
          </Button>
        </div>
      </div>

      {/* Results Display */}
      <div className="space-y-2">
        <Label>4. Results</Label>
        <div className="grid grid-cols-2 gap-3">
          {/* Start Count */}
          <div className="p-3 bg-muted rounded">
            <div className="text-xs text-muted-foreground">Start Count</div>
            <div className="text-lg font-mono">
              {startCount !== null ? startCount : "---"}
            </div>
          </div>

          {/* End Count */}
          <div className="p-3 bg-muted rounded">
            <div className="text-xs text-muted-foreground">End Count</div>
            <div className="text-lg font-mono">
              {endCount !== null ? endCount : "---"}
            </div>
          </div>

          {/* Count Difference */}
          <div className="p-3 bg-muted rounded">
            <div className="text-xs text-muted-foreground">Count Difference</div>
            <div className="text-lg font-mono">
              {countDifference !== null ? countDifference : "---"}
            </div>
          </div>

          {/* Calibration Constant */}
          <div className="p-3 bg-primary/10 rounded border border-primary/30">
            <div className="text-xs text-muted-foreground">
              Calibration Constant
            </div>
            <div className="text-lg font-mono font-bold text-primary">
              {calibrationConstant !== null ? calibrationConstant : "---"}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="space-y-2">
        <Label>5. Save to Server</Label>
        <Button
          onClick={handleSubmit}
          disabled={!calibrationConstant || isSaving}
          className="w-full"
        >
          {isSaving ? "Saving..." : "SUBMIT CALIBRATION"}
        </Button>
      </div>

      {/* Formula Explanation */}
      <div className="text-xs text-muted-foreground border-t pt-4 mt-6">
        <strong>Formula:</strong> CalibrationConstant = Volume ÷ (EndCount - StartCount)
      </div>
    </div>
  );
}
