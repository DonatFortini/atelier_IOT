import { serve } from "bun";
import index from "./index.html";

let sensorData = [];
const MAX_DATA_POINTS = 500;

interface sensorData {
  id: number;
  temperature: number;
  upper_limit: number;
  critical_limit: number;
  color: [number, number, number];
}

const server = serve({
  routes: {
    "/*": index,

    "/api/temperature": {
      async POST(req) {
        try {
          let data: sensorData;
          try {
            data = await req.json();
          } catch (jsonError) {
            console.error("Invalid JSON received:", jsonError);
            return Response.json(
              {
                success: false,
                message: "Invalid JSON format: " + jsonError.message,
              },
              { status: 400 }
            );
          }

          const timestamp = new Date();
          const formattedTime = timestamp.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          });

          const newDataPoint = {
            ...data,
            time: formattedTime,
            timestamp: timestamp.getTime(),
          };

          sensorData.push(newDataPoint);

          if (sensorData.length > MAX_DATA_POINTS) {
            sensorData.shift();
          }

          return Response.json({ success: true, data: newDataPoint });
        } catch (error) {
          console.error("Error while processing POST request:", error);
          return Response.json(
            { success: false, message: error.message },
            { status: 500 }
          );
        }
      },
    },

    "/api/data": {
      async GET() {
        return Response.json(sensorData);
      },
    },

    "/api/clear": {
      async POST() {
        sensorData = [];
        return Response.json({ success: true });
      },
    },
  },
});

console.log(`🚀 Server running at ${server.url}`);
