import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../agent/agent.service';
import { matchPasswordsValidator } from 'src/app/shared/customValidators/customValidators';
import {
  HONDURAS_DEPARTMENTS,
  StrongPasswordRegx,
} from 'src/app/constants/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDateToInput } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-agent-edit',
  templateUrl: './agent-edit.component.html',
  styleUrls: ['./agent-edit.component.scss'],
})
export class AgentEditComponent {
  states: string[] = HONDURAS_DEPARTMENTS;
  agentId: string = this.route.snapshot.paramMap.get('id')!;
  agentForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.agentId = this.route.snapshot.paramMap.get('id')!;

    this.agentForm = this.fb.group(
      {
        id: [''],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        idNumber: [{ value: '', disabled: true }, [Validators.required]],
        email: [
          { value: '', disabled: true },
          [Validators.required, Validators.email],
        ],
        dateOfBirth: ['', Validators.required],
        privilege: ['', Validators.required],
        contactInformation: this.fb.group({
          phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
          city: ['', Validators.required],
          address: ['', Validators.required],
          state: ['', Validators.required],
        }),
        biography: [''],
        password: ['', [Validators.pattern(StrongPasswordRegx)]],
        confirmPassword: [''],
        isActive: [true, Validators.required],
      },
      { validators: matchPasswordsValidator('password', 'confirmPassword') }
    );

    this.loadAgentData();
  }
  loadAgentData(): void {
    this.agentService.getAgent(this.agentId).subscribe((agent) => {
      this.agentForm.patchValue(agent);

      const formattedDate = formatDateToInput(agent.dateOfBirth);
      this.agentForm.patchValue({ dateOfBirth: formattedDate });
    });
  }

  formatIdNumber(): void {
    const control = this.agentForm.get('idNumber');
    if (!control) return;

    let rawValue = control.value.replace(/\D/g, '');

    if (rawValue.length > 13) {
      rawValue = rawValue.substring(0, 13);
    }

    let formattedValue = rawValue;
    if (rawValue.length > 4) {
      formattedValue = rawValue.slice(0, 4) + '-' + rawValue.slice(4);
    }
    if (rawValue.length > 8) {
      formattedValue = formattedValue.slice(0, 9) + '-' + rawValue.slice(8);
    }

    control.setValue(formattedValue, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.agentForm.valid) {
      const updatedAgent = this.agentForm.getRawValue();
      this.agentService.updateAgent(updatedAgent).subscribe({
        next: () => {
          //TODO make a helper snackbar service in shared. input message and add styles depending if warning, error, success and overload duration (not required)
          this.snackBar.open('Agent updated successfully!', 'Close', {
            duration: 3000,
          });

          this.router.navigate(['/agents']);
        },
      });
    }
  }
}
