export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: number;
  dateOfBirth: string;
  civilStatus?: string;
  educationLevel?: string;
  guardianShipSection?: any;
  studentSection?: any;
  contactInformation?: ContactInformation;
  houseZone?: string;
  email?: string;
  program?: string;
  referral?: string;
  diagnostic?: string;
  secondDiagnostic?: string;
  gender: string;
  status?: string;
}

export interface ContactInformation {
  phone?: string;
  email?: string;
}
