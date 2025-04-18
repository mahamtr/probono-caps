import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../patient.service';
import { CONFIG_TYPES } from 'src/app/constants/constants';
import { DatePipe } from '@angular/common';
import { formatDateToInput } from 'src/app/shared/utils/utils';
import { AuthService } from 'src/app/shared/auth.service';
import { AdminService } from 'src/app/admin/admin.service';

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
  programs: string[] = [];
  showStudentSection = false;
  canEditPatient = false;
  majors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private adminService: AdminService // Added AdminService
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
        phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
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
      status: ['Active'],
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

    this.canEditPatient = this.authService.canEditPatient();

    if (!this.canEditPatient) {
      this.patientForm.disable();
    }

    if (!this.authService.canEnablePatient()) {
      this.patientForm.get('status')?.disable();
    }

    this.adminService.fetchConfigs().subscribe((configs) => {
      this.majors = configs.filter(config => config.type === CONFIG_TYPES.MAJOR).map(config => config.name);
      this.programs = configs.filter(config => config.type === CONFIG_TYPES.PROGRAM).map(config => config.name);
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

      const formattedDate = formatDateToInput(patient.dateOfBirth);
      this.patientForm.patchValue({ dateOfBirth: formattedDate });
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
    const majorForm = this.patientForm.get('studentSection')?.get('major');
    const studyYear = this.patientForm.get('studentSection')?.get('studyYear');

    if (this.showStudentSection) {
      // majorForm?.setValidators(Validators.required);
      // studyYear?.setValidators(Validators.required);
      //TODO FIX THIS. REMOVRE VALIDATORS ARE NOT WORKING
    } else {
      majorForm?.get('major')?.setValidators([]);
      studyYear?.get('studyYear')?.setValidators([]);
    }
    this.patientForm.updateValueAndValidity({ onlySelf: false });
  }

  calculateAge(dob: string) {
    const birthDate = new Date(dob);
    const age = this.today.getFullYear() - birthDate.getFullYear();
    this.patientForm.patchValue({ age });

    this.showGuardianSection = age < 21;
    const guardianGroup = this.patientForm.get('guardianShipSection');

    if (this.showGuardianSection) {
      //TODO FIX THIS. REMOVRE VALIDATORS ARE NOT WORKING
      // guardianGroup
      //   ?.get('guardianShipName')
      //   ?.setValidators(Validators.required);
      // guardianGroup
      //   ?.get('guardianShipPhone')
      //   ?.setValidators(Validators.required);
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
