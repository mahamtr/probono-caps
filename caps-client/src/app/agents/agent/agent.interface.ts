export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  dateOfBirth: string; // oder Date, falls du es als Datumstyp verwenden möchtest
  privilege: string;
  password: string;
  contactInformation: {
    phoneNumber: number;
    city: string;
    address: string;
    state: string;
  };
  biography: string;
  isActive: boolean;
}
