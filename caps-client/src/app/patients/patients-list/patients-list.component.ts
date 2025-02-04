import { Component } from '@angular/core';
import { Patient } from '../patient/patient.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PatientService } from '../patient.service';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss'],
})
export class PatientsListComponent {
  displayedColumns: string[] = [
    'name',
    'age',
    'phone',
    'program',
    'zone',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Patient>();

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadFetch();
  }
  getAge(dateOfBirth: string): number {
    if (!dateOfBirth) return 0;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  loadFetch(): void {
    this.patientService.getPatients().subscribe(
      (patients) => (this.dataSource.data = patients),
      (error) => console.error('Error fetching patients', error)
    );
  }

  editPatient(id: string): void {
    this.router.navigate(['/patients/edit', id]);
  }

  deletePatient(id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this patient?' },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.patientService.deletePatient(id).subscribe(() => {
          this.snackBar.open('Patient deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadFetch();
        });
      }
    });
  }
}
