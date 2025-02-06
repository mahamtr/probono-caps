import { Component } from '@angular/core';
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
} from 'src/app/constants/constants';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss'],
})
export class AppointmentEditComponent {
  appointmentForm: FormGroup;
  patient: Patient = {} as Patient;
  diagnosticOptions = DIAGNOSTIC_OPTIONS;
  taskOptions = TASK_OPTIONS;
  interventionOptions = INTERVENTION_OPTIONS;

  file1: File | null = null;
  file2: File | null = null;
  file1Name: string = '';
  file2Name: string = '';
  file1Url: string | null = null;
  file2Url: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {
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
      status: [''],
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
          this.appointmentForm.patchValue(appointment);

          if (appointment.blobUrls && appointment.blobUrls.length > 0) {
            this.file1Name = appointment.blobUrls[0];
          }
          if (appointment.blobUrls && appointment.blobUrls.length > 1) {
            this.file2Name = appointment.blobUrls[1];
          }

          this.patientService
            .getPatientById(appointment.patientId)
            .subscribe((patient) => {
              this.patient = patient;
            });
        });
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
  deleteFile(fileType: string): void {
    const fileName = fileType === 'file1' ? this.file1Name : this.file2Name;
    if (!fileName) return;

    this.appointmentService
      .deleteFile(this.appointmentForm.value.id, fileName)
      .subscribe(
        (res) => {
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
  downloadFile(fileType: string): void {
    const fileName = fileType === 'file1' ? this.file1Name : this.file2Name;
    if (!fileName) return;

    this.appointmentService.downloadFile(fileName).subscribe(
      (response: string) => {
        window.open(response, '_blank');
      },
      () => {
        this.snackBar.open('File download failed', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}
