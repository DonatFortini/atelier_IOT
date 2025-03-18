"use client";

import { useState, useEffect, useReducer, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TemperatureChart } from "./TemperatureChart";
import { LEDStatusCard } from "./LEDStatusCard";
import { SensorInfo } from "./SensorInfo";

// Interface definitions
export interface SensorReading {
  id: number;
  temperature: number;
  upper_limit: number;
  critical_limit: number;
  color: number[];
  time?: string;
  timestamp?: number;
}

export interface ChartDataPoint {
  time: string;
  fullTime: string;
  temp: number;
  upper: number;
  critical: number;
  color: string;
}

// State management with reducer for more predictable updates
interface DashboardState {
  data: ChartDataPoint[];
  sensorData: SensorReading[];
  currentReading: ChartDataPoint | null;
  loading: boolean;
  error: string | null;
  lastUpdate: number;
  connectionLost: boolean;
  retryCount: number;
}

type DashboardAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: SensorReading[] }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "CONNECTION_RESTORED" }
  | { type: "UI_REFRESH" }
  | { type: "MANUAL_REFRESH" };

const initialState: DashboardState = {
  data: [],
  sensorData: [],
  currentReading: null,
  loading: true,
  error: null,
  lastUpdate: Date.now(),
  connectionLost: false,
  retryCount: 0,
};

function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        lastUpdate: Date.now(),
      };
    case "FETCH_SUCCESS": {
      const formattedData = formatDataForChart(action.payload);
      return {
        ...state,
        sensorData: action.payload,
        data: formattedData,
        currentReading: formattedData.length > 0 ? formattedData[0] : null,
        loading: false,
        error: null,
        lastUpdate: Date.now(),
        connectionLost: false,
        retryCount: 0,
      };
    }
    case "FETCH_ERROR":
      return {
        ...state,
        error: action.error,
        connectionLost: true,
        retryCount: state.retryCount + 1,
        lastUpdate: Date.now(),
      };
    case "CONNECTION_RESTORED":
      return {
        ...state,
        connectionLost: false,
        error: null,
        retryCount: 0,
      };
    case "UI_REFRESH":
      return {
        ...state,
        lastUpdate: Date.now(),
      };
    case "MANUAL_REFRESH":
      return {
        ...state,
        loading: true,
        error: null,
      };
    default:
      return state;
  }
}

// Utility functions
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function formatDataForChart(data: SensorReading[]): ChartDataPoint[] {
  if (!Array.isArray(data) || data.length === 0) return [];

  return data
    .map((reading) => {
      // Extract just the seconds and milliseconds part for the chart
      const timeString = reading.time || "Unknown";
      const timeParts = timeString.split(":");
      const secondsPart = timeParts.length > 2 ? timeParts[2] : "00";

      return {
        time: secondsPart, // Just show seconds.milliseconds
        fullTime: timeString, // Store full time for tooltips
        temp: reading.temperature,
        upper: reading.upper_limit,
        critical: reading.critical_limit,
        color: Array.isArray(reading.color)
          ? rgbToHex(reading.color[0], reading.color[1], reading.color[2])
          : "#00ff00",
      };
    })
    .reverse()
    .slice(0, 20); // Show most recent 20 data points
}

// Main Dashboard component
function Dashboard() {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const [forceRenderKey, setForceRenderKey] = useState(0);

  // Manual refresh function
  const handleManualRefresh = useCallback(() => {
    dispatch({ type: "MANUAL_REFRESH" });
    setForceRenderKey((prev) => prev + 1);
  }, []);

  // Data fetching function with error handling
  const fetchData = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_START" });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch("/api/data", {
        signal: controller.signal,
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const text = await response.text();

      if (!text || text.trim() === "") {
        throw new Error("Empty response received");
      }

      let sensorData: SensorReading[];
      try {
        sensorData = JSON.parse(text);
        if (!Array.isArray(sensorData)) {
          throw new Error("Response is not an array");
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError, "Response:", text);
        throw new Error(`Failed to parse JSON: ${parseError.message}`);
      }

      if (state.connectionLost) {
        dispatch({ type: "CONNECTION_RESTORED" });
      }

      dispatch({ type: "FETCH_SUCCESS", payload: sensorData });
    } catch (err) {
      console.error("Error fetching data:", err);
      dispatch({ type: "FETCH_ERROR", error: err.message || "Unknown error" });
    }
  }, [state.connectionLost]);

  // Initial data fetch and polling setup
  useEffect(() => {
    // Immediate fetch
    fetchData();

    // Set up polling interval - adjusted based on connection state
    const interval = setInterval(
      () => {
        fetchData();
      },
      state.connectionLost ? 3000 : 1000
    ); // Poll more slowly when connection is lost

    // Set up UI refresh interval
    const refreshInterval = setInterval(() => {
      dispatch({ type: "UI_REFRESH" });
    }, 200); // Refresh UI faster than data fetch for smooth updates

    // Cleanup function
    return () => {
      clearInterval(interval);
      clearInterval(refreshInterval);
    };
  }, [fetchData, state.connectionLost]);

  // Get temperature status
  const getTemperatureStatus = () => {
    if (!state.currentReading)
      return { status: "Unknown", message: "Données indisponibles" };

    if (state.currentReading.temp >= state.currentReading.critical) {
      return {
        status: "Critique",
        message: "La température a dépassé le seuil critique !",
      };
    } else if (state.currentReading.temp >= state.currentReading.upper) {
      return {
        status: "Avertissement",
        message: "La température a dépassé la limite supérieure.",
      };
    } else {
      return {
        status: "Normal",
        message: "La température est dans la plage normale.",
      };
    }
  };

  // Loading state
  if (state.loading || !state.currentReading) {
    return (
      <div className="container mx-auto p-4" key={forceRenderKey}>
        <h1 className="text-2xl font-bold mb-6">
          Tableau de Bord du Capteur de Température
        </h1>

        {state.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de connexion</AlertTitle>
            <AlertDescription>
              {state.error}
              <div className="mt-2">
                <button
                  onClick={handleManualRefresh}
                  className="flex items-center text-sm bg-secondary px-2 py-1 rounded-md hover:bg-secondary/80 transition-colors"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Rafraîchir manuellement
                </button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="p-8 text-center border rounded-lg">
          <p>En attente des données du capteur...</p>
          {state.connectionLost && state.retryCount > 1 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Tentative de reconnexion... ({state.retryCount})
              </p>
              <button
                onClick={handleManualRefresh}
                className="inline-flex items-center text-sm bg-primary text-primary-foreground px-3 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Rafraîchir
                manuellement
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error alert if there's an error but we still have data to show
  const errorAlert = state.error && (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur de connexion</AlertTitle>
      <AlertDescription>
        {state.error}
        <div className="mt-2">
          <button
            onClick={handleManualRefresh}
            className="flex items-center text-sm bg-secondary px-2 py-1 rounded-md hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Rafraîchir manuellement
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );

  const tempStatus = getTemperatureStatus();

  // Main dashboard layout with key for forced re-rendering
  return (
    <div className="container mx-auto p-4" key={forceRenderKey}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Tableau de Bord du Capteur de Température
        </h1>
        <button
          onClick={handleManualRefresh}
          className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors"
          title="Rafraîchir les données"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="text-sm">Rafraîchir</span>
        </button>
      </div>

      {errorAlert}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-3">
          <TemperatureChart data={state.data} />
        </div>

        <div className="lg:col-span-2">
          <LEDStatusCard currentReading={state.currentReading} />
        </div>
      </div>

      <SensorInfo
        tempStatus={tempStatus}
        currentReading={state.currentReading}
      />
    </div>
  );
}

export { Dashboard };
