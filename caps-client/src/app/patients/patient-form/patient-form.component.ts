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
  today = new Date();
  showGuardianSection = false;
  showStudentSection = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.patientForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      age: [{ value: '', disabled: true }],
      civilStatus: [''],
      educationLevel: [''],
      contactInformation: this.fb.group({
        phoneNumber: [''],
        city: [''],
        state: [''],
        address: [''],
      }),
      studentSection: this.fb.group({
        major: [''],
        studyYear: [0],
      }),
      houseZone: [''],
      email: ['', Validators.email],
      program: [''],
      referral: [''],
      diagnostic: [''],
      secondDiagnostic: [''],
      gender: ['', Validators.required],
      status: [''],
      guardianShipSection: this.fb.group({
        guardianShipName: [''],
        guardianShipPhone: [''],
      }),
    });

    this.patientForm.get('dateOfBirth')?.valueChanges.subscribe((dob) => {
      if (dob) this.calculateAge(dob);
    });

    this.patientForm.get('program')?.valueChanges.subscribe((program) => {
      this.toggleStudentSection(program);
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

  onSave() {
    if (this.patientForm.invalid) return;
    if (this.isEditMode) {
      this.patientService
        .updatePatient(this.patientForm.value)
        .subscribe((res) => {
          if (res) {
            this.snackBar.open('Patient updated successfully', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/patients']);
          }
        });
    } else {
      this.patientService
        .createPatient(this.patientForm.value)
        .subscribe((res) => {
          if (res) {
            this.snackBar.open('Patient created successfully', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/patients']);
          }
        });
    }
  }

  toggleStudentSection(program: string) {
    this.showStudentSection = program === 'UNAH-VS';
    const studentGroup = this.patientForm.get('studentSection');

    if (this.showStudentSection) {
      studentGroup?.get('major')?.setValidators(Validators.required);
      studentGroup?.get('studyYear')?.setValidators(Validators.required);
    } else {
      studentGroup?.get('major')?.clearValidators();
      studentGroup?.get('studyYear')?.clearValidators();
    }
    studentGroup?.updateValueAndValidity();
  }

  calculateAge(dob: string) {
    const birthDate = new Date(dob);
    const age = this.today.getFullYear() - birthDate.getFullYear();
    this.patientForm.patchValue({ age });

    this.showGuardianSection = age < 21;
    const guardianGroup = this.patientForm.get('guardianShipSection');

    if (this.showGuardianSection) {
      guardianGroup
        ?.get('guardianShipName')
        ?.setValidators(Validators.required);
      guardianGroup
        ?.get('guardianShipPhone')
        ?.setValidators(Validators.required);
    } else {
      guardianGroup?.get('guardianShipName')?.clearValidators();
      guardianGroup?.get('guardianShipPhone')?.clearValidators();
    }
    guardianGroup?.updateValueAndValidity();
  }

  onCancel() {
    this.router.navigate(['/patients']);
  }
}
