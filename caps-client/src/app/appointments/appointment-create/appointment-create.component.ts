import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Subscription,
  fromEvent,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { AppointmentService } from '../appointment.service';
import { Agent } from 'src/app/agents/agent/agent.interface';
import { Patient } from 'src/app/patients/patient/patient.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss'],
})
export class AppointmentCreateComponent {
  appointmentForm!: FormGroup;
  keyupSubscription!: Subscription;
  filteredPatients: Patient[] = [];
  filteredAgents: Agent[] = [];

  @ViewChild('patientInput', { static: true }) patientInput!: ElementRef;
  @ViewChild('agentInput', { static: true }) agentInput!: ElementRef;
  selectedPatient: Patient | undefined;
  selectedAgent: Agent | undefined;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Autocomplete for Patients
    this.keyupSubscription = fromEvent(this.patientInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
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
      fromEvent(this.agentInput.nativeElement, 'keyup')
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
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
      patientId: ['', Validators.required],
      agentId: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      reason: ['', Validators.required],
      status: ['In Progress'],
    });
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedPatientId = event.option.value;
    this.selectedPatient = this.filteredPatients.find(
      (patient) => patient.id === selectedPatientId
    );
  }

  onAgentSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedPatientId = event.option.value;
    this.selectedAgent = this.filteredAgents.find(
      (patient) => patient.id === selectedPatientId
    );
  }

  submit() {
    if (this.appointmentForm.valid) {
      this.appointmentService
        .createAppointment(this.appointmentForm.value)
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
}
