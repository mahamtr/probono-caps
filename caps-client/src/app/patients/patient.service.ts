import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Patient } from './patient/patient.interface';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private apiService: ApiService) {}

  getPatients(): Observable<Patient[]> {
    return this.apiService.get<Patient[]>('/patients');
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  updatePatient(id: string, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
