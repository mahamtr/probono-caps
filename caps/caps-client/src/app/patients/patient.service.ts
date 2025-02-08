import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Patient } from './patient/patient.interface';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private apiService: ApiService) {}

  getPatients(): Observable<Patient[]> {
    return this.apiService.get<Patient[]>('api/patient/getAll');
  }

  getPatientById(id: string): Observable<Patient> {
    return this.apiService.get<Patient>('api/patient/' + id);
  }

  createPatient(patient: Patient): Observable<boolean> {
    return this.apiService.post<boolean>('api/patient/createPatient', patient);
  }

  updatePatient(patient: Patient): Observable<boolean> {
    return this.apiService.patch<boolean>('api/patient/updatePatient', patient);
  }

  deletePatient(id: string): Observable<HttpEvent<boolean>> {
    return this.apiService.delete<boolean>('api/patient/' + id, {});
  }
}
