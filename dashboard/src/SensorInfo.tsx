import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type ChartDataPoint } from "./Dashboard";
import formulaImage from "../public/formule.png";
interface SensorInfoProps {
  tempStatus: {
    status: string;
    message: string;
  };
  currentReading: ChartDataPoint;
}

export function SensorInfo({ tempStatus, currentReading }: SensorInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du Capteur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert
            variant={
              tempStatus.status === "Critique" ? "destructive" : "default"
            }
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Statut: {tempStatus.status}</AlertTitle>
            <AlertDescription>{tempStatus.message}</AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Dernière Mise à Jour</h3>
              <p className="text-sm">{currentReading.fullTime} </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">ID du Capteur</h3>
              <p className="text-sm">TEMP-001</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Emplacement</h3>
              <p className="text-sm">Salle Serveur</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Notes</h3>
            <p className="text-sm">
              L'intensité de chaque canal (Rouge, Vert, Bleu) est calculée en
              fonction de la température :
            </p>
            <div className="flex justify-center">
              <img src={formulaImage} alt="Formule" width={380} height={80} />
            </div>
            <p className="text-sm">
              où : T est la température actuelle, T<sub>min</sub>, T
              <sub>max</sub> sont les valeurs limites, C<sub>min</sub>, C
              <sub>max</sub> sont les couleurs associées aux températures min et
              max.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
