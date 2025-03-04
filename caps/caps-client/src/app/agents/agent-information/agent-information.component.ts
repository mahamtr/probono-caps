import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgentService } from '../agent/agent.service';
import { matchPasswordsValidator } from 'src/app/shared/customValidators/customValidators';
import { AuthService } from 'src/app/shared/auth.service';
import { StrongPasswordRegx } from 'src/app/constants/constants';

@Component({
  selector: 'app-agent-information',
  templateUrl: './agent-information.component.html',
  styleUrls: ['./agent-information.component.scss'],
})
export class AgentInformationComponent {
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [Validators.required, Validators.pattern(StrongPasswordRegx)],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: matchPasswordsValidator('newPassword', 'confirmPassword') }
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.passwordForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('pattern')) {
      return 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)';
    }
    return '';
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.agentService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.snackBar.open(
            'Password changed successfully! Please login again.',
            'Close',
            {
              duration: 3000,
            }
          );
          this.authService.logout();
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open(
            error.error.message || 'Invalid credentials',
            'Close',
            {
              duration: 3000,
            }
          );
        },
      });
    }
  }
}
