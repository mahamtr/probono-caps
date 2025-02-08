import { Component } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { DashboardTotals } from '../models/totals.interface';
import { Observable } from 'rxjs';
import { AppointmentTableDto } from 'src/app/appointments/appointment/appointment.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  totals!: DashboardTotals;
  nextAppointments!: Observable<AppointmentTableDto[]>;

  constructor(dashboardService: DashboardService) {
    dashboardService.getTotals().subscribe((res) => {
      this.totals = res;
    });

    this.nextAppointments = dashboardService.getLatestAppointment();
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  }

  dashboardData = {
    totalPatients: 625,
    totalAgents: 125,
    totalAppointments: 50,
    nextAppointments: [
      {
        specialty: 'Heart Surgeon',
        time: '10:30 - 12:30',
        doctor: 'Caroline Hutomo',
      },
      {
        specialty: 'Pediatrician',
        time: '09:30 - 10:30',
        doctor: 'Anggia Melanie',
      },
      {
        specialty: 'Neurologist',
        time: '11:10 - 14:00',
        doctor: 'Malik Abimanyu',
      },
    ],
  };
}
