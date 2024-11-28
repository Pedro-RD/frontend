export interface HealthReportDTO {
  arterialBloodPressure: string;
  temperature: number;
  height: number;
  weight: number;
  respiratoryRate: number;
  heartRate: number;
  bloodGlucoseLevel: number;
  mobility: string;
  hydrationLevel: string;
  cognitiveEmotionalAssessment: string;
  bloodOxygenLevel: number;
}

export interface HealthReport extends HealthReportDTO {
  id: number;
}
