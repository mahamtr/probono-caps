import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Observable } from 'rxjs';
import { DashboardTotals } from './models/totals.interface';
import {
  Appointment,
  AppointmentTableDto,
} from '../appointments/appointment/appointment.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getTotals(): Observable<DashboardTotals> {
    return this.apiService.get<DashboardTotals>('api/dashboard/totals');
  }

  getLatestAppointment(): Observable<AppointmentTableDto[]> {
    return this.apiService.get<AppointmentTableDto[]>(
      'api/dashboard/appointments'
    );
  }
}
