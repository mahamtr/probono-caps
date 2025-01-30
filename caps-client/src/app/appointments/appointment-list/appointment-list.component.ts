import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { AppointmentService } from '../appointment.service';

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

  statuses = ['Scheduled', 'Canceled', 'Complete', 'Pending'];
  rooms = ['Room 1', 'Room 2', 'Room 3'];
  programs = ['World Vision', 'UNAH-VS'];

  selectedStatus = '';
  selectedRoom = '';
  selectedProgram = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private router: Router
  ) {}

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
      const roomMatch = !filters.room || data.location === filters.room;
      const programMatch = !filters.program || data.program === filters.program;
      return statusMatch && roomMatch && programMatch;
    };

    const filter = {
      status: this.selectedStatus,
      room: this.selectedRoom,
      program: this.selectedProgram,
    };

    this.dataSource.filter = JSON.stringify(filter);
  }

  onFilterChange() {
    this.applyFilters();
  }

  resetFilters() {
    this.selectedStatus = '';
    this.selectedRoom = '';
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
}
