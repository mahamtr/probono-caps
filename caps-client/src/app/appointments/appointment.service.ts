import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Observable } from 'rxjs';
import {
  Appointment,
  AppointmentTableDto,
} from './appointment/appointment.interface';
import { HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private apiService: ApiService) {}

  getAppointments(): Observable<Appointment[]> {
    return this.apiService.get<Appointment[]>('api/appointment/list');
  }

  getAppointmentsTable(): Observable<AppointmentTableDto[]> {
    return this.apiService.get<AppointmentTableDto[]>('api/appointment/table');
  }
  getAppointmentsCalendar(
    startDate: string,
    endDate: string
  ): Observable<Appointment[]> {
    return this.apiService.get<Appointment[]>(
      `api/appointment/calendar?startDate=${startDate}&endDate=${endDate}`
    );
  }
  getAppointmentById(id: string): Observable<Appointment> {
    return this.apiService.get<Appointment>('api/appointment/' + id);
  }

  updateAppointment(appt: Appointment): Observable<boolean> {
    return this.apiService.patch<boolean>('api/appointment/update', appt);
  }

  deleteAppointment(id: string): Observable<HttpEvent<boolean>> {
    return this.apiService.delete<boolean>(`api/appointment/${id}`, null);
  }

  createAppointment(appointmnet: Appointment): Observable<string> {
    return this.apiService.post<string>(`api/appointment/create`, appointmnet);
  }

  //TODO move this to their respective service.
  searchPatients(query: string): Observable<any[]> {
    return this.apiService.get<any[]>(`api/patient/search?search=${query}`);
  }

  searchAgents(query: string): Observable<any[]> {
    return this.apiService.get<any[]>(`api/agent/search?search=${query}`);
  }
}
