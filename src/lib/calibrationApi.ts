// Mock API functions for calibration
// These will be replaced with real endpoints later

export interface SensorInfo {
  id: string;
  deviceId: string;
  port: number;
  label: string;
}

export interface CalibrationResult {
  sensorId: string;
  calibrationConstant: number;
  startCount: number;
  endCount: number;
  countDifference: number;
  volume: number;
  timestamp: string;
}

// Mock sensor data
export const mockSensors: SensorInfo[] = [
  { id: "Device_001_Sensor_1", deviceId: "Device_001", port: 1, label: "Device 001 - Port 1" },
  { id: "Device_001_Sensor_2", deviceId: "Device_001", port: 2, label: "Device 001 - Port 2" },
  { id: "Device_001_Sensor_3", deviceId: "Device_001", port: 3, label: "Device 001 - Port 3" },
  { id: "Device_001_Sensor_4", deviceId: "Device_001", port: 4, label: "Device 001 - Port 4" },
  { id: "Device_002_Sensor_1", deviceId: "Device_002", port: 1, label: "Device 002 - Port 1" },
  { id: "Device_002_Sensor_2", deviceId: "Device_002", port: 2, label: "Device 002 - Port 2" },
  { id: "Device_002_Sensor_3", deviceId: "Device_002", port: 3, label: "Device 002 - Port 3" },
  { id: "Device_002_Sensor_4", deviceId: "Device_002", port: 4, label: "Device 002 - Port 4" },
];

// Simulates polling the sensor via Raspberry Pi gateway
export async function pollSensor(deviceId: string, sensorPort: number): Promise<number> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
  
  // Return a mock aggregate count
  // In production, this would poll the actual device via RS485
  return Math.floor(10000 + Math.random() * 50000);
}

// Compute calibration constant
export function computeCalibrationConstant(
  startCount: number,
  endCount: number,
  volumeMl: number
): { countDifference: number; calibrationConstant: number } {
  const countDifference = endCount - startCount;
  
  if (countDifference === 0) {
    throw new Error("Count difference is zero. Please ensure water flowed through the sensor.");
  }
  
  const calibrationConstant = volumeMl / countDifference;
  
  return {
    countDifference,
    calibrationConstant: Math.round(calibrationConstant * 100000) / 100000, // 5 decimal places
  };
}

// Save calibration constant to server
export async function saveCalibrationConstant(
  sensorId: string,
  calibrationConstant: number,
  metadata?: {
    startCount: number;
    endCount: number;
    volume: number;
  }
): Promise<{ success: boolean; message: string }> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
  
  // Mock response - in production this would be a real API call
  console.log("Saving calibration constant:", {
    sensorId,
    calibrationConstant,
    ...metadata,
    timestamp: new Date().toISOString(),
  });
  
  // Simulate occasional failure for testing
  if (Math.random() < 0.1) {
    throw new Error("Network error: Unable to reach server. Please try again.");
  }
  
  return {
    success: true,
    message: `Calibration constant ${calibrationConstant} saved successfully for sensor ${sensorId}`,
  };
}

// Get list of available sensors
export async function fetchSensors(): Promise<SensorInfo[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSensors;
}
