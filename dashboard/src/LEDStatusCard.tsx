import { ThermometerIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartDataPoint, hexToRgb } from "./Dashboard";

interface LEDStatusCardProps {
  currentReading: ChartDataPoint;
}

export function LEDStatusCard({ currentReading }: LEDStatusCardProps) {
  const rgbColor = hexToRgb(currentReading.color);

  return (
    <Card className="h-[70vh]">
      <CardHeader>
        <CardTitle>État Actuel de la LED</CardTitle>
        <CardDescription>
          Couleur de la LED basée sur la lecture de température
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[calc(100%-5rem)]">
        <div
          className="w-40 h-40 rounded-full mb-6 border border-border flex items-center justify-center"
          style={{ backgroundColor: currentReading.color }}
        >
          <ThermometerIcon
            className="h-16 w-16 text-white drop-shadow-md"
            style={{ filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.5))" }}
          />
        </div>

        <div className="space-y-4 w-full max-w-xs">
          <div className="grid grid-cols-2 gap-2 p-4 rounded-lg bg-muted">
            <div className="text-sm font-medium">Temp. Actuelle:</div>
            <div className="text-sm font-bold text-right">
              {currentReading.temp.toFixed(2)}°C
            </div>

            <div className="text-sm font-medium">Limite Sup.:</div>
            <div className="text-sm text-right">
              {currentReading.upper.toFixed(2)}°C
            </div>

            <div className="text-sm font-medium">Limite Critique:</div>
            <div className="text-sm text-right">
              {currentReading.critical.toFixed(2)}°C
            </div>

            <div className="text-sm font-medium">Couleur Hex:</div>
            <div className="text-sm font-mono text-right">
              {currentReading.color}
            </div>

            <div className="text-sm font-medium">Couleur RGB:</div>
            <div className="text-sm font-mono text-right">
              {`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
