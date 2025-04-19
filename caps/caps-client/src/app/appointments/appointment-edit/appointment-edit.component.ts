import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../appointment.service';
import { Patient } from 'src/app/patients/patient/patient.interface';
import { PatientService } from 'src/app/patients/patient.service';
import {
  DIAGNOSTIC_OPTIONS,
  INTERVENTION_OPTIONS,
  TASK_OPTIONS,
  APPOINTMENT_STATUSES,
  FAMILYCORE_OPTIONS,
  REMISSION_OPTIONS,
} from 'src/app/constants/constants';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-info-dialog',
  template: `
    <h1 mat-dialog-title>Family Information</h1>
    <div mat-dialog-content>
      <p>{{ data.info }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </div>
  `,
})
export class InfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { info: string }) {}
}

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss'],
})
export class AppointmentEditComponent {
  statuses = Object.values(APPOINTMENT_STATUSES);
  appointmentForm: FormGroup;
  patient: Patient = {} as Patient;
  diagnosticOptions = DIAGNOSTIC_OPTIONS;
  taskOptions = TASK_OPTIONS;
  interventionOptions = INTERVENTION_OPTIONS;
  canEditAppointment = false;
  familyCoreOptions = FAMILYCORE_OPTIONS;
  remissionOptions = REMISSION_OPTIONS;

  file1: File | null = null;
  file2: File | null = null;
  file1Name: string = '';
  file2Name: string = '';
  file1Id: string = '';
  file2Id: string = '';

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.canEditAppointment = this.authService.canEditAppointment();
    this.appointmentForm = this.fb.group({
      id: [''],
      reason: ['', Validators.required],
      familyComposition: [''],
      mode: [''],
      organicDisease: [''],
      diseaseDetail: [''],
      medication: [''],
      treatingDoctor: [''],
      historyOfMentalIllness: [''],
      mentalIllnessDetail: [''],
      interventionOne: [''],
      interventionTwo: [''],
      detailAttention: [''],
      taskOne: [''],
      taskTwo: [''],
      tracing: [''],
      remissionApplies: [''],
      destination: [''],
      diagnosticOne: [''],
      diagnosticTwo: [''],
      status: [APPOINTMENT_STATUSES.COMPLETED],
      scheduledDate: ['', Validators.required],
      lastUpdated: [''],
      patientId: ['', Validators.required],
      agentId: ['', Validators.required],
      blobUrls: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentService
        .getAppointmentById(id)
        .subscribe((appointment) => {
          //default status for next step
          appointment.status = APPOINTMENT_STATUSES.COMPLETED;

          this.appointmentForm.patchValue(appointment);

          if (appointment.blobUrls && appointment.blobUrls.length > 0) {
            this.file1Id = appointment.blobUrls[0];
            // Get the file name for display
            this.appointmentService
              .getFileName(this.file1Id)
              .subscribe((name) => (this.file1Name = name));
          }
          if (appointment.blobUrls && appointment.blobUrls.length > 1) {
            this.file2Id = appointment.blobUrls[1];
            // Get the file name for display
            this.appointmentService
              .getFileName(this.file2Id)
              .subscribe((name) => (this.file2Name = name));
          }

          this.patientService
            .getPatientById(appointment.patientId)
            .subscribe((patient) => {
              this.patient = patient;
            });
        });
    }
    if (!this.canEditAppointment) {
      this.appointmentForm.disable();
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.appointmentService
        .updateAppointment(this.appointmentForm.value)
        .subscribe(() => {
          this.snackBar.open('Appointment updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/appointments']);
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/appointments']);
  }

  generatePDF(): void {
    // TODO: Implement PDF generation
  }

  // Handle file selection
  onFileSelected(event: any, fileType: string): void {
    event.stopPropagation();
    const file: File = event.target.files[0];
    if (file && file.size <= 25 * 1024 * 1024) {
      // Check file size
      if (fileType === 'file1') {
        this.file1 = file;
        this.file1Name = file.name;
        this.uploadFile(file, 'file1'); // Automatically upload file 1
      } else if (fileType === 'file2') {
        this.file2 = file;
        this.file2Name = file.name;
        this.uploadFile(file, 'file2'); // Automatically upload file 2
      }
    } else {
      this.snackBar.open('File size must be less than 25MB', 'Close', {
        duration: 3000,
      });
    }
  }

  // Upload file to the backend
  uploadFile(file: File, fileType: string): void {
    const formData = new FormData();
    formData.append('file', file);

    this.appointmentService
      .uploadFile(this.appointmentForm.value.id, formData)
      .subscribe(
        (response: any) => {
          this.snackBar.open('File uploaded successfully', 'Close', {
            duration: 3000,
          });
        },  
        (error) => {
          this.snackBar.open('File upload failed', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  // Delete file from the backend
  deleteFile(fileType: string, event: Event): void {
    event.stopPropagation();
    const fileId = fileType === 'file1' ? this.file1Id : this.file2Id;
    if (!fileId) return;

    this.appointmentService
      .deleteFile(this.appointmentForm.value.id, fileId)
      .subscribe(
        (res) => {
          if (fileType === 'file1') {
            this.file1Name = '';
            this.file1Id = '';
            this.file1 = null;
          } else {
            this.file2Name = '';
            this.file2Id = '';
            this.file2 = null;
          }
          this.snackBar.open('File deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        () => {
          this.snackBar.open('File deletion failed', 'Close', {
            duration: 3000,
          });
        }
      );
  }

  // Download file from the backend
  downloadFile(fileType: string, event: Event): void {
    event.stopPropagation();
    const fileId = fileType === 'file1' ? this.file1Id : this.file2Id;
    const fileName = fileType === 'file1' ? this.file1Name : this.file2Name;
    if (!fileId) return;

    this.appointmentService.downloadFile(fileId).subscribe(
      (blob) => {
        saveAs(blob, fileName);
      },
      (e) => {
        this.snackBar.open('File download failed', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  openDialog(): void {
    this.dialog.open(InfoDialogComponent, {
      data: { info: 'Details about family composition and related information.' },
    });
  }
}
