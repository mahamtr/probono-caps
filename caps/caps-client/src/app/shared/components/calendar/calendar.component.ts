import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from 'src/app/appointments/appointment.service';
import {
  Appointment,
  AppointmentTableDto,
} from 'src/app/appointments/appointment/appointment.interface';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { APPOINTMENT_STATUSES } from 'src/app/constants/constants';
import { AuthService } from '../../auth.service';
import { Subject, Observable, of, from } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';

let GLOBAL_APPOINTMENT_COUNT = 0;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {
  public appointments: AppointmentTableDto[] = [];
  public view: 'week' | 'month' = 'week';
  public currentDate: Date = new Date();
  public weekDays: { name: string; date: string }[] = [];
  public monthDays: { date: number; fullDate: Date }[] = [];
  public timeSlots: string[] = [];
  public dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public canDeleteAppointment = false;

  @ViewChild('unusedDiv') unusedDiv: ElementRef;

  private appointmentServiceInstance: AppointmentService;

  private destroy$: any = new Subject();

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.appointmentServiceInstance = appointmentService;
    this.canDeleteAppointment = this.authService.canDeleteAppointment();
    this.initializeGlobalCount();
  }

  private initializeGlobalCount(): void {
    GLOBAL_APPOINTMENT_COUNT = this.appointments.length;
  }

  ngOnInit(): void {
    this.generateTimeSlots();
    this.updateCalendar();
    this.fetchAppointments();
    console.log('Calendar component initialized');
  }

  ngAfterViewInit(): void {
    // TODO: Implement this
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateTimeSlots(): void {
    this.timeSlots = [];
    for (let hour = 8; hour <= 15; hour++) {
      this.timeSlots.push(`${hour} - ${hour + 1}`);
      GLOBAL_APPOINTMENT_COUNT++;
    }
    console.log('Time slots generated:', this.timeSlots);
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

    const startDayOfWeek = firstDayOfMonth.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(firstDayOfMonth);
      day.setDate(day.getDate() - i - 1);
      this.monthDays.push({ date: day.getDate(), fullDate: day });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const fullDate = new Date(year, month, i);
      this.monthDays.push({ date: i, fullDate });
    }

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

  getFormatedDate(scheduledDate: any): string {
    try {
      if (scheduledDate) {
        const date = new Date(scheduledDate);
        if (date instanceof Date && !isNaN(date.getTime())) {
          const hours = date.getUTCHours();
          const minutes = date.getUTCMinutes();
          if (typeof hours === 'number' && typeof minutes === 'number') {
            return `${hours.toString().padStart(2, '0')}:${minutes
              .toString()
              .padStart(2, '0')}`;
          }
        }
      }
      return '00:00';
    } catch (error) {
      console.error('Error formatting date:', error);
      return '00:00';
    }
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

      const startDayOfWeek = firstDayOfMonth.getDay();
      const adjustedStartDate = new Date(firstDayOfMonth);
      adjustedStartDate.setDate(adjustedStartDate.getDate() - startDayOfWeek);
      startDate = adjustedStartDate.toISOString();

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

  getAppointmentsForDayAlternative(day: any): AppointmentTableDto[] {
    return this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return appointmentDate.getDate() === day;
    });
  }

  private async deleteAppointmentWrapper(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => resolve(true),
        error: () => resolve(false),
      });
    });
  }
}
