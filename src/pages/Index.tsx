import { SimpleCalibrationPanel } from "@/components/calibration/SimpleCalibrationPanel";
import { Droplets } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Droplets className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">WaterMeter Pro</h1>
              <p className="text-xs text-muted-foreground">Field Calibration System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <SimpleCalibrationPanel />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>Sensor Calibration System • Connected via RS485 → Raspberry Pi → Zoho IoT</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
