import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { AppointmentService } from '../appointment.service';
import {
  CONFIG_TYPES,
  APPOINTMENT_STATUSES,
} from 'src/app/constants/constants';
import { AuthService } from 'src/app/shared/auth.service';
import { AdminService } from 'src/app/admin/admin.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent {
  displayedColumns: string[] = [
    'appointmentId',
    'reason',
    'patientName',
    'age',
    'program',
    'appointmentDate',
    'mode',
    'location',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource();

  statuses = Object.values(APPOINTMENT_STATUSES);
  programs: string[] = [];

  selectedStatus = '';
  selectedProgram = '';
  canDeleteAppointment = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService // Added AdminService
  ) {
    this.canDeleteAppointment = this.authService.canDeleteAppointment();

    this.adminService.fetchConfigs().subscribe((configs) => {
      this.programs = configs
        .filter((config) => config.type === CONFIG_TYPES.PROGRAM)
        .map((config) => config.name);
    });
  }

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAppointmentsTable().subscribe((appointments) => {
      let filteredAppointments = appointments;

      this.dataSource.data = filteredAppointments;
      this.dataSource.paginator = this.paginator;
    });
  }
  applyFilters() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filters = JSON.parse(filter);
      const statusMatch = !filters.status || data.status === filters.status;
      const programMatch = !filters.program || data.program === filters.program;
      return statusMatch && programMatch;
    };

    const filter = {
      status: this.selectedStatus,
      program: this.selectedProgram,
    };

    this.dataSource.filter = JSON.stringify(filter);
  }

  onFilterChange() {
    this.applyFilters();
  }

  resetFilters() {
    this.selectedStatus = '';
    this.selectedProgram = '';
    this.applyFilters();
  }

  editAppointment(id: string) {
    this.router.navigate([`/appointments/edit/${id}`]);
  }

  confirmDelete(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '300px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appointmentService.deleteAppointment(id).subscribe(() => {
          this.loadAppointments();
        });
      }
    });
  }

  navigateToAddAppointment() {
    this.router.navigate(['/appointments/create']);
  }

  moveToCompleted(appointmentId: string) {
    this.updateAppointmentStatus(appointmentId, APPOINTMENT_STATUSES.COMPLETED);
  }

  cancelAppointment(appointmentId: string) {
    this.updateAppointmentStatus(appointmentId, APPOINTMENT_STATUSES.CANCELED);
  }

  moveToScheduled(appointmentId: string) {
    this.updateAppointmentStatus(appointmentId, APPOINTMENT_STATUSES.SCHEDULED);
  }

  private updateAppointmentStatus(appointmentId: string, status: string) {
    this.appointmentService
      .getAppointmentById(appointmentId)
      .subscribe((appointment) => {
        appointment.status = status;
        this.appointmentService.updateAppointment(appointment).subscribe(() => {
          this.loadAppointments();
        });
      });
  }
}
