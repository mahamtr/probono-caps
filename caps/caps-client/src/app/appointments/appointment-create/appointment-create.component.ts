import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Subscription,
  fromEvent,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  merge,
  startWith,
} from 'rxjs';
import { AppointmentService } from '../appointment.service';
import { Agent } from 'src/app/agents/agent/agent.interface';
import { Patient } from 'src/app/patients/patient/patient.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { APPOINTMENT_STATUSES } from 'src/app/constants/constants';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss'],
})
export class AppointmentCreateComponent {
  statuses = Object.values(APPOINTMENT_STATUSES);
  appointmentForm!: FormGroup;
  keyupSubscription!: Subscription;
  filteredPatients: Patient[] = [];
  filteredAgents: Agent[] = [];

  @ViewChild('patientInput', { static: true }) patientInput!: ElementRef;
  @ViewChild('agentInput', { static: true }) agentInput!: ElementRef;
  selectedPatient: Patient | undefined;
  selectedAgent: Agent | undefined;
  availableTimes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  generateTimeOptions(): void {
    for (let hour = 8; hour <= 15; hour++) {
      const formattedHour = hour.toString().padStart(2, '0'); // Ensure 2-digit format
      this.availableTimes.push(`${formattedHour}:00`);
    }
  }

  ngOnInit(): void {
    this.generateTimeOptions();
    this.initForm();

    // Retrieve query parameters
    this.activatedRoute.queryParams.subscribe((params) => {
      const date = params['date'];
      const time = params['time'];

      if (date) {
        this.appointmentForm.get('datePart')?.setValue(new Date(date));
      }

      if (time) {
        const timeValue = this.availableTimes.find((t) =>
          t.startsWith(time.padStart(2, '0'))
        );
        if (timeValue) {
          this.appointmentForm.get('timePart')?.setValue(timeValue);
        }
      }
    });

    // Autocomplete for Patients
    this.keyupSubscription = merge(
      fromEvent(this.patientInput.nativeElement, 'focus').pipe(startWith('')),
      fromEvent(this.patientInput.nativeElement, 'keyup').pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
    )
      .pipe(
        switchMap(() =>
          this.appointmentService.searchPatients(
            this.patientInput.nativeElement.value
          )
        )
      )
      .subscribe((data) => {
        this.filteredPatients = data;
      });

    // Autocomplete for Agents
    this.keyupSubscription.add(
      merge(
        fromEvent(this.agentInput.nativeElement, 'focus').pipe(startWith('')),
        fromEvent(this.agentInput.nativeElement, 'keyup').pipe(
          debounceTime(1000),
          distinctUntilChanged()
        )
      )
        .pipe(
          switchMap(() =>
            this.appointmentService.searchAgents(
              this.agentInput.nativeElement.value
            )
          )
        )
        .subscribe((data) => {
          this.filteredAgents = data;
        })
    );
  }

  initForm() {
    this.appointmentForm = this.fb.group({
      patientIdSelect: [''],
      patientId: [null],
      agentId: ['', Validators.required],
      scheduledDate: [''],
      datePart: [null, Validators.required],
      timePart: [null, Validators.required],
      reason: ['', Validators.required],
      status: [{ value: APPOINTMENT_STATUSES.SCHEDULED, disabled: true }],
      newPatientFirstName: ['', Validators.required],
      newPatientLastName: ['', Validators.required],
      newPatientIDNumber: ['', Validators.required],
    });
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedPatientId = event.option.value;
    this.selectedPatient = this.filteredPatients.find(
      (patient) => patient.id === selectedPatientId
    );
    this.appointmentForm.get('patientId')?.setValue(selectedPatientId);
  }

  onAgentSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedAgentId = event.option.value;
    this.selectedAgent = this.filteredAgents.find(
      (patient) => patient.id === selectedAgentId
    );
  }

  private combineDateTime(date: Date, time: string): string {
    const isoDate = date.toLocaleDateString('sv-SE').split('T')[0]; // Extract YYYY-MM-DD
    return `${isoDate}T${time}:00`; // Correct ISO format
  }

  submit() {
    if (this.appointmentForm.valid) {
      const date = this.appointmentForm.get('datePart')?.value;
      const time = this.appointmentForm.get('timePart')?.value;

      if (date && time) {
        const fullDateTime = this.combineDateTime(date, time);
        this.appointmentForm.patchValue({ scheduledDate: fullDateTime });
      }

      const newPatientFirstName = this.appointmentForm.get(
        'newPatientFirstName'
      )?.value;
      const newPatientLastName =
        this.appointmentForm.get('newPatientLastName')?.value;
      const newPatientIDNumber =
        this.appointmentForm.get('newPatientIDNumber')?.value;

      // New patient
      const newPatientData = {
        firstName: newPatientFirstName,
        lastName: newPatientLastName,
        idNumber: Number(newPatientIDNumber),
      };
      this.appointmentService
        .createAppointment({
          ...this.appointmentForm.getRawValue(),
          newPatient: newPatientData,
        })
        .subscribe((response) => {
          this.router.navigate([`/appointments/edit/${response}`]);
        });
    }
  }

  cancel() {
    this.router.navigate(['/appointments']);
  }

  ngOnDestroy(): void {
    this.keyupSubscription.unsubscribe();
  }

  onTabChange(event: any): void {
    const isNewPatientTab = event.index === 0;
    const newPatientFirstNameControl = this.appointmentForm.get(
      'newPatientFirstName'
    );
    const newPatientLastNameControl =
      this.appointmentForm.get('newPatientLastName');
    const newPatientIDNumberControl =
      this.appointmentForm.get('newPatientIDNumber');

    const patientSelect = this.appointmentForm.get('patientId');

    if (isNewPatientTab) {
      newPatientFirstNameControl?.setValidators([Validators.required]);
      newPatientLastNameControl?.setValidators([Validators.required]);
      newPatientIDNumberControl?.setValidators([Validators.required]);
    } else {
      patientSelect?.setValidators([Validators.required]);
      newPatientFirstNameControl?.clearValidators();
      newPatientLastNameControl?.clearValidators();
      newPatientIDNumberControl?.clearValidators();
    }
    patientSelect?.updateValueAndValidity();
    newPatientFirstNameControl?.updateValueAndValidity();
    newPatientLastNameControl?.updateValueAndValidity();
    newPatientIDNumberControl?.updateValueAndValidity();
  }
}
