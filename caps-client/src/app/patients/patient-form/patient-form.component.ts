import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
})
export class PatientFormComponent {
  patientForm: FormGroup;
  isEditMode = false;
  patientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      civilStatus: [''],
      educationLevel: [''],
      houseZone: [''],
      email: ['', Validators.email],
      program: [''],
      referral: [''],
      diagnostic: [''],
      secondDiagnostic: [''],
      gender: ['', Validators.required],
      status: ['Active'],
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId) {
      this.isEditMode = true;
      this.loadPatientData();
    }
  }

  loadPatientData() {
    this.patientService.getPatientById(this.patientId!).subscribe((patient) => {
      this.patientForm.patchValue(patient);
    });
  }

  savePatient() {
    if (this.patientForm.invalid) return;

    if (this.isEditMode) {
      this.patientService
        .updatePatient(this.patientForm.value)
        .subscribe(() => {
          this.snackBar.open('Patient updated successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/patients']);
        });
    } else {
      this.patientService
        .createPatient(this.patientForm.value)
        .subscribe(() => {
          this.snackBar.open('Patient created successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/patients']);
        });
    }
  }

  cancel() {
    this.router.navigate(['/patients']);
  }
}
