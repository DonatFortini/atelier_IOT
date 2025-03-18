import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { type ChartDataPoint } from "./Dashboard";

interface TemperatureChartProps {
  data: ChartDataPoint[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  return (
    <Card className="h-[70vh] overflow-hidden">
      <CardHeader>
        <CardTitle>Température au Fil du Temps</CardTitle>
        <CardDescription>
          Affichage de la température avec limites supérieure et critique
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] overflow-hidden">
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="time"
                padding={{ left: 10, right: 10 }}
                tick={{ fontSize: 10 }}
                label={{
                  value: "Secondes.ms",
                  position: "insideBottomRight",
                  offset: -5,
                }}
                reversed
              />
              <YAxis
                domain={[
                  (dataMin: number) => Math.max(0, dataMin - 5),
                  (dataMax: number) => dataMax + 5,
                ]}
              />
              <Tooltip
                content={({
                  active,
                  payload,
                }: {
                  active?: boolean;
                  payload?: any[];
                }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border p-2 rounded-md shadow-md">
                        <p className="font-medium">{`${payload[0].payload.fullTime}`}</p>
                        <p className="text-xs text-muted-foreground">
                          Secondes: {payload[0].payload.time}
                        </p>
                        <p className="text-sm text-[hsl(var(--chart-1))]">{`Température: ${payload[0].value}°C`}</p>
                        <p className="text-sm text-[hsl(var(--chart-2))]">{`Limite sup.: ${payload[0].payload.upper}°C`}</p>
                        <p className="text-sm text-[hsl(var(--chart-3))]">{`Limite crit.: ${payload[0].payload.critical}°C`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTemp)"
                dot={true}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="upper"
                stroke="hsl(var(--chart-2))"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="critical"
                stroke="hsl(var(--chart-3))"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
