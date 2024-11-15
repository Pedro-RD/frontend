import { Resident } from "./resident";

export interface HealthReportDTO {
  arterialBloodPressure: string;
  temperature: number;
  height: number;
  weight: number;
  respiratoryRate: number;
  heartRate: string;
  bloodGlucoseLevel: number;
  mobility: string;
  hydrationLevel: string;
  cognitiveEmotionalAssessment: number;
  bloodOxygenLevel: number;
  resident: Resident | null;
}

export interface HealthReport extends HealthReportDTO {
  id: number; // Propriedade obrigatória
}
