import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { Appointment } from '../appointment/appointment.interface';
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

  statuses = ['Active', 'Cancelled', 'Complete'];
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
    this.appointmentService.getAppointments().subscribe((appointments) => {
      this.dataSource.data = appointments;
      this.dataSource.paginator = this.paginator;
    });
  }

  editAppointment(id: string) {
    this.router.navigate([`/appointment/edit/${id}`]);
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
