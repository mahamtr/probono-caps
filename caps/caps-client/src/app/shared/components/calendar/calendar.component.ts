import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from 'src/app/appointments/appointment.service';
import {
  Appointment,
  AppointmentTableDto,
} from 'src/app/appointments/appointment/appointment.interface';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { APPOINTMENT_STATUSES } from 'src/app/constants/constants';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  appointments: AppointmentTableDto[] = [];
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

    // Add leading days from the previous month
    const startDayOfWeek = firstDayOfMonth.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(firstDayOfMonth);
      day.setDate(day.getDate() - i - 1);
      this.monthDays.push({ date: day.getDate(), fullDate: day });
    }

    // Add days of the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const fullDate = new Date(year, month, i);
      this.monthDays.push({ date: i, fullDate });
    }

    // Add trailing days from the next month
    const endDayOfWeek = lastDayOfMonth.getDay();
    for (let i = 1; i < 7 - endDayOfWeek; i++) {
      const day = new Date(lastDayOfMonth);
      day.setDate(day.getDate() + i);
      this.monthDays.push({ date: day.getDate(), fullDate: day });
    }
  }

  getAppointmentsForDay(day: any): AppointmentTableDto[] {
    return this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate.getDate() === day;
    });
  }

  getFormatedDate(scheduledDate: any) {
    const date = new Date(scheduledDate);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

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

  getAppointmentsForDayAndTime(
    day: string,
    time: string
  ): AppointmentTableDto[] {
    return this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const appointmentDay = appointmentDate.getUTCDate();
      const calendarDay = new Date(day).getUTCDate();
      const appointmentHour = appointmentDate.getUTCHours();
      const timeHour = parseInt(time.split('-')[0], 10);
      return appointmentHour === timeHour && calendarDay === appointmentDay;
    });
  }

  openDeleteModal(appointment: AppointmentTableDto): void {
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

  onEdit(appointment: AppointmentTableDto): void {
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
    let startDate: string;
    let endDate: string;

    if (this.view === 'month') {
      const firstDayOfMonth = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        0
      );

      // Adjust start date to include leading days from the previous month
      const startDayOfWeek = firstDayOfMonth.getDay();
      const adjustedStartDate = new Date(firstDayOfMonth);
      adjustedStartDate.setDate(adjustedStartDate.getDate() - startDayOfWeek);
      startDate = adjustedStartDate.toISOString();

      // Adjust end date to include trailing days from the next month
      const endDayOfWeek = lastDayOfMonth.getDay();
      const adjustedEndDate = new Date(lastDayOfMonth);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + (6 - endDayOfWeek));
      endDate = adjustedEndDate.toISOString();
    } else {
      startDate = this.getStartDate();
      endDate = this.getEndDate();
    }

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

  onCellClick(day: string, time?: string): void {
    const date = new Date(day);
    if (this.view === 'month') {
      date.setDate(date.getDate() + 1);
    }
    const formattedDate = date.toISOString().split('T')[0];

    const hour = time ? time.split('-')[0].trim() : '';
    const navigationExtras: NavigationExtras = {
      queryParams: {
        date: formattedDate,
      },
    };
    if (hour)
      navigationExtras.queryParams = {
        ...navigationExtras.queryParams,
        time: hour,
      };
    this.router.navigate(['/appointments/create'], navigationExtras);
  }

  onReschedule(appointment: AppointmentTableDto): void {
    const newDate = new Date(appointment.appointmentDate);
    newDate.setDate(newDate.getDate() + 7);
    const updatedAppointment = {
      ...appointment,
      scheduledDate: newDate,
    };
    this.appointmentService
      .rescheduleAppointment(updatedAppointment as unknown as Appointment)
      .subscribe(() => {
        this.fetchAppointments();
      });
  }
}
