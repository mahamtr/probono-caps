import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentService } from '../agent/agent.service';
import { Agent } from '../agent/agent.interface';
import { StrongPasswordRegx } from 'src/app/constants/constants';
import { matchPasswordsValidator } from 'src/app/shared/customValidators/customValidators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agent-create',
  templateUrl: './agent-create.component.html',
  styleUrls: ['./agent-create.component.scss'],
})
export class AgentCreateComponent {
  agentForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.agentForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        idNumber: ['', [Validators.required, Validators.minLength(13)]],
        email: ['', [Validators.required, Validators.email]],
        dateOfBirth: ['', Validators.required],
        privilege: ['Intern', Validators.required],
        contactInformation: this.fb.group({
          phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
          city: ['', Validators.required],
          address: ['', Validators.required],
          state: ['', Validators.required],
        }),
        password: [
          '',
          [Validators.required, Validators.pattern(StrongPasswordRegx)],
        ],
        confirmPassword: [''],
        biography: [''],
        isActive: [true, Validators.required],
      },
      { validators: matchPasswordsValidator('password', 'confirmPassword') }
    );
  }

  onSubmit(): void {
    if (this.agentForm.valid) {
      const agent: Agent = this.agentForm.value;

      this.agentService.createAgent(agent).subscribe({
        next: () => {
          //TODO make a helper snackbar service in shared. input message and add styles depending if warning, error, success and overload duration (not required)
          this.snackBar.open('Agent created successfully!', 'Close', {
            duration: 3000,
          });

          this.router.navigate(['/agents']);
        },
      });
    }
  }
}
