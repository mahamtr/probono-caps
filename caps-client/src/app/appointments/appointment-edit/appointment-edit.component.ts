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
}
