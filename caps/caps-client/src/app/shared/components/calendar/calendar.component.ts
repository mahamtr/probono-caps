import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from 'src/app/appointments/appointment.service';
import { Appointment } from 'src/app/appointments/appointment/appointment.interface';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { Router } from '@angular/router';
import { APPOINTMENT_STATUSES } from 'src/app/constants/constants';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  appointments: Appointment[] = [];
  view: 'week' | 'month' = 'week';

  currentDate: Date = new Date();
  weekDays: { name: string; date: string }[] = [];
  monthDays: { date: number; fullDate: Date }[] = [];
  timeSlots: string[] = [];
  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generateTimeSlots();
    this.updateCalendar();
    this.fetchAppointments();
  }

  generateTimeSlots(): void {
    for (let hour = 8; hour <= 15; hour++) {
      this.timeSlots.push(`${hour} - ${hour + 1}`);
    }
  }

  updateCalendar(): void {
    if (this.view === 'week') {
      this.generateWeekDays();
    } else {
      this.generateMonthDays();
    }
  }

  generateWeekDays(): void {
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        name: this.dayNames[day.getDay()],
        date: day.toISOString().split('T')[0],
      });
    }
  }

  generateMonthDays(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    this.monthDays = [];

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const fullDate = new Date(year, month, i);
      this.monthDays.push({ date: i, fullDate });
    }
  }

  getAppointmentsForDay(day: any): Appointment[] {
    return this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.scheduledDate);
      return appointmentDate.getDate() === day;
    });
  }

  getFormatedDate(scheduledDate: any) {
    const date = new Date(scheduledDate);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  getRangeLabel(): string {
    if (this.view === 'week') {
      const startOfWeek = new Date(this.currentDate);
      startOfWeek.setDate(
        this.currentDate.getDate() - this.currentDate.getDay()
      );
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    } else {
      const startOfMonth = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        0
      );

      return `${startOfMonth.toLocaleDateString()} - ${endOfMonth.toLocaleDateString()}`;
    }
  }

  getAppointmentsForDayAndTime(day: string, time: string): Appointment[] {
    return this.appointments.filter((appointment) => {
      debugger;
      const appointmentDate = new Date(appointment.scheduledDate);
      const appointmentDay = appointmentDate.getDate();
      const calendarDay = new Date(day).getDate();
      const hours = appointmentDate.getHours();
      return (
        time.split('-')[0].includes(hours.toString()) &&
        calendarDay === appointmentDay
      );
    });
  }

  openDeleteModal(appointment: Appointment): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '250px',
      data: { appointment },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appointmentService
          .deleteAppointment(appointment.id)
          .subscribe(() => {
            this.appointments = this.appointments.filter(
              (a) => a.id !== appointment.id
            );
          });
      }
    });
  }

  onEdit(appointment: Appointment): void {
    this.router.navigate(['appointments/edit/' + appointment.id]);
  }

  navigate(direction: 'prev' | 'next'): void {
    if (this.view === 'week') {
      this.currentDate.setDate(
        this.currentDate.getDate() + (direction === 'prev' ? -7 : 7)
      );
    } else {
      this.currentDate.setMonth(
        this.currentDate.getMonth() + (direction === 'prev' ? -1 : 1)
      );
    }
    this.updateCalendar();
    this.fetchAppointments();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.updateCalendar();
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const startDate = this.getStartDate();
    const endDate = this.getEndDate();
    this.appointmentService
      .getAppointmentsCalendar(startDate, endDate)
      .subscribe((data) => {
        this.appointments = data;
        this.updateCalendar();
      });
  }

  getStartDate(): string {
    if (this.view === 'week') {
      const startOfWeek = new Date(this.currentDate);
      startOfWeek.setDate(
        this.currentDate.getDate() - this.currentDate.getDay()
      );
      return startOfWeek.toISOString();
    } else {
      const startOfMonth = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        1
      );
      return startOfMonth.toISOString();
    }
  }

  getEndDate(): string {
    if (this.view === 'week') {
      const endOfWeek = new Date(this.currentDate);
      endOfWeek.setDate(
        this.currentDate.getDate() - this.currentDate.getDay() + 6
      );
      return endOfWeek.toISOString();
    } else {
      const endOfMonth = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        0
      );
      return endOfMonth.toISOString();
    }
  }

  changeView(view: 'week' | 'month'): void {
    this.view = view;
    this.updateCalendar();
    this.fetchAppointments();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case APPOINTMENT_STATUSES.SCHEDULED:
        return '#90CAF9'; // Light Blue (Material Blue 300)
      case APPOINTMENT_STATUSES.CANCELED:
        return '#EF9A9A'; // Light Red (Material Red 300)
      case APPOINTMENT_STATUSES.COMPLETED:
        return '#A5D6A7'; // Light Green (Material Green 300)
      default:
        return '#B0BEC5'; // Subtle Gray (Material Blue Grey 300)
    }
  }
}
