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

  uploadFile(id: string, data: FormData): Observable<boolean> {
    return this.apiService.post<boolean>(`api/appointment/${id}/blob`, data);
  }

  downloadFile(blobName: string): Observable<string> {
    return this.apiService.get<string>(
      `api/appointment/blob/download?blobName=${encodeURIComponent(blobName)}`
    );
  }

  deleteFile(id: string, blobName: string): Observable<HttpEvent<boolean>> {
    return this.apiService.delete<boolean>(
      `api/appointment/blob?blobName=${encodeURIComponent(
        blobName
      )}&appointmentId=${id}`,
      {}
    );
  }

  getAppointmentsTable(): Observable<AppointmentTableDto[]> {
    return this.apiService.get<AppointmentTableDto[]>('api/appointment/table');
  }
  getAppointmentsCalendar(
    startDate: string,
    endDate: string
  ): Observable<AppointmentTableDto[]> {
    return this.apiService.get<AppointmentTableDto[]>(
      `api/appointment/calendar?startDate=${startDate}&endDate=${endDate}`
    );
  }
  getAppointmentById(id: string): Observable<Appointment> {
    return this.apiService.get<Appointment>('api/appointment/' + id);
  }

  updateAppointment(appt: Appointment): Observable<boolean> {
    return this.apiService.patch<boolean>('api/appointment/update', appt);
  }

  rescheduleAppointment(appt: Appointment): Observable<boolean> {
    return this.apiService.patch<boolean>('api/appointment/reschedule', appt);
  }

  deleteAppointment(id: string): Observable<HttpEvent<boolean>> {
    return this.apiService.delete<boolean>(`api/appointment/${id}`, {});
  }

  createAppointment(appointment: Appointment): Observable<string> {
    return this.apiService.post<string>(`api/appointment/create`, appointment);
  }

  //TODO move this to their respective service.
  searchPatients(query: string): Observable<any[]> {
    return this.apiService.get<any[]>(`api/patient/search?search=${query}`);
  }

  searchAgents(query: string): Observable<any[]> {
    return this.apiService.get<any[]>(`api/agent/search?search=${query}`);
  }
}
