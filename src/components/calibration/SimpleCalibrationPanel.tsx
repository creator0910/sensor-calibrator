import { useState } from "react";

// ===== MOCK DATA (Replace with real API later) =====
const SENSORS = [
  "Device_001_Sensor_1",
  "Device_001_Sensor_2",
  "Device_001_Sensor_3",
  "Device_001_Sensor_4",
  "Device_002_Sensor_1",
  "Device_002_Sensor_2",
];

// Mock function to get sensor count (replace with real API)
function pollSensor(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 50000) + 10000);
    }, 1000);
  });
}

// Mock function to save to server (replace with real API)
function saveToServer(sensorId: string, constant: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saved:", { sensorId, calibrationConstant: constant });
      resolve();
    }, 1000);
  });
}

// ===== MAIN COMPONENT =====
export function SimpleCalibrationPanel() {
  // Form inputs
  const [sensor, setSensor] = useState("");
  const [volume, setVolume] = useState(500);

  // Calibration data
  const [isRunning, setIsRunning] = useState(false);
  const [startCount, setStartCount] = useState<number | null>(null);
  const [endCount, setEndCount] = useState<number | null>(null);
  const [message, setMessage] = useState("Ready");

  // Calculate results
  const diff = startCount !== null && endCount !== null ? endCount - startCount : null;
  const constant = diff && diff > 0 ? (volume / diff).toFixed(5) : null;

  // Start calibration
  async function start() {
    if (!sensor) {
      alert("Select a sensor first");
      return;
    }
    setMessage("Getting start count...");
    setIsRunning(true);
    setEndCount(null);
    const count = await pollSensor();
    setStartCount(count);
    setMessage("Running... Pass water through, then click STOP");
  }

  // Stop calibration
  async function stop() {
    setMessage("Getting end count...");
    let count = await pollSensor();
    // Ensure end > start for demo
    if (startCount && count <= startCount) {
      count = startCount + Math.floor(Math.random() * 5000) + 1000;
    }
    setEndCount(count);
    setIsRunning(false);
    setMessage("Done! Review and submit.");
  }

  // Reset
  function reset() {
    setStartCount(null);
    setEndCount(null);
    setIsRunning(false);
    setMessage("Ready");
  }

  // Save
  async function submit() {
    if (!constant) return;
    setMessage("Saving...");
    await saveToServer(sensor, parseFloat(constant));
    setMessage("Saved successfully!");
  }

  // ===== UI =====
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Sensor Calibration</h1>

      {/* Status */}
      <div style={{ background: "#f0f0f0", padding: 10, marginBottom: 20, textAlign: "center", borderRadius: 4 }}>
        {message}
      </div>

      {/* Sensor Select */}
      <div style={{ marginBottom: 15 }}>
        <label>1. Select Sensor:</label>
        <select
          value={sensor}
          onChange={(e) => setSensor(e.target.value)}
          disabled={isRunning}
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        >
          <option value="">-- Choose --</option>
          {SENSORS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Volume Input */}
      <div style={{ marginBottom: 15 }}>
        <label>2. Volume (ml):</label>
        <input
          type="number"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          disabled={isRunning}
          style={{ width: "100%", padding: 8, marginTop: 5 }}
        />
      </div>

      {/* Buttons */}
      <div style={{ marginBottom: 15 }}>
        <label>3. Run Calibration:</label>
        <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
          <button onClick={start} disabled={isRunning} style={{ flex: 1, padding: 10 }}>
            START
          </button>
          <button onClick={stop} disabled={!isRunning} style={{ flex: 1, padding: 10 }}>
            STOP
          </button>
          <button onClick={reset} style={{ padding: 10 }}>
            RESET
          </button>
        </div>
      </div>

      {/* Results */}
      <div style={{ marginBottom: 15 }}>
        <label>4. Results:</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 5 }}>
          <div style={{ background: "#f0f0f0", padding: 10, borderRadius: 4 }}>
            <small>Start Count</small>
            <div style={{ fontSize: 18, fontFamily: "monospace" }}>{startCount ?? "---"}</div>
          </div>
          <div style={{ background: "#f0f0f0", padding: 10, borderRadius: 4 }}>
            <small>End Count</small>
            <div style={{ fontSize: 18, fontFamily: "monospace" }}>{endCount ?? "---"}</div>
          </div>
          <div style={{ background: "#f0f0f0", padding: 10, borderRadius: 4 }}>
            <small>Difference</small>
            <div style={{ fontSize: 18, fontFamily: "monospace" }}>{diff ?? "---"}</div>
          </div>
          <div style={{ background: "#e0f7fa", padding: 10, borderRadius: 4, border: "1px solid #00897b" }}>
            <small>Calibration Constant</small>
            <div style={{ fontSize: 18, fontFamily: "monospace", fontWeight: "bold" }}>{constant ?? "---"}</div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div style={{ marginBottom: 15 }}>
        <label>5. Save:</label>
        <button
          onClick={submit}
          disabled={!constant}
          style={{ width: "100%", padding: 12, marginTop: 5, background: "#00897b", color: "white", border: "none", borderRadius: 4 }}
        >
          SUBMIT
        </button>
      </div>

      {/* Formula */}
      <div style={{ fontSize: 12, color: "#666", borderTop: "1px solid #ddd", paddingTop: 10 }}>
        <b>Formula:</b> Constant = Volume ÷ (EndCount - StartCount)
      </div>
    </div>
  );
}
