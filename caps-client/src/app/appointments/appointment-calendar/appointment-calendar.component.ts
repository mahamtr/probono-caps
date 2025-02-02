import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss'],
})
export class AppointmentCalendarComponent {
  constructor(private router: Router) {}

  navigateToCreate(): void {
    this.router.navigate(['/appointments/create']);
  }
}
