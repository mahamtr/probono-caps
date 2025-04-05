export interface Appointment {
  id: string;
  reason: string;
  familyComposition?: string;
  mode?: string;
  organicDisease?: string;
  diseaseDetail?: string;
  medication?: string;
  treatingDoctor?: string;
  historyOfMentalIllness?: string;
  appointmentId?: string;
  mentalIllnessDetail?: string;
  interventionOne?: string;
  interventionTwo?: string;
  detailAttention?: string;
  taskOne?: string;
  taskTwo?: string;
  tracing?: string;
  remissionApplies?: string;
  destination?: string;
  diagnosticOne?: string;
  diagnosticTwo?: string;
  status?: string;
  scheduledDate: Date;
  lastUpdated?: Date;
  patientId: string;
  agentId: string;
  blobUrls?: string[];
  newPatient?: {
    firstName?: string;
    lastName?: string;
    idNumber?: number;
  };
}

export interface AppointmentTableDto {
  id: string;
  reason: string;
  patientName: string;
  age: number;
  program: string;
  appointmentDate: Date;
  mode?: string;
  location?: string;
  status?: string;
  appointmentId?: string;
}
