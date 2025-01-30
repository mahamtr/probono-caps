export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: number;
  dateOfBirth: string;
  civilStatus?: string;
  educationLevel?: string;
  guardianShipSection?: GuardianShipSection;
  studentSection?: StudentSection;
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
  phoneNumber?: string;
  email?: string;
}

export interface StudentSection {
  major?: string;
  studyYear?: string;
}

export interface GuardianShipSection {
  guardianShipName?: string;
  guardianShipPhone?: string;
}
