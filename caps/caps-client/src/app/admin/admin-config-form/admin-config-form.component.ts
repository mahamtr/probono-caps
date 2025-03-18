import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService, ConfigItem } from '../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONFIG_TYPES } from 'src/app/constants/constants';

@Component({
  selector: 'app-admin-config-form',
  templateUrl: './admin-config-form.component.html',
  styleUrls: ['./admin-config-form.component.scss'],
})
export class AdminConfigFormComponent implements OnInit {
  configForm: FormGroup;
  type: string = '';
  id: string | null = null;
  isEditMode: boolean = false;
  typeOptions = Object.values(CONFIG_TYPES);

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.configForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.type =
      this.route.snapshot.queryParams['type'] ||
      this.route.snapshot.params['type'];
    this.id = this.route.snapshot.params['id'];
    this.isEditMode = !!this.id;

    if (this.type) {
      this.configForm.patchValue({ type: this.type });
    }

    if (this.isEditMode) {
      this.loadItem();
    }
  }

  loadItem(): void {
    if (!this.id) return;

    this.adminService.getConfig(this.id).subscribe({
      next: (item: ConfigItem) => {
        this.configForm.patchValue({
          name: item.name,
          type: item.type,
        });
      },
      error: () => {
        this.snackBar.open('Error loading item', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onSubmit(): void {
    if (this.configForm.valid) {
      const formValue = this.configForm.value;
      const item: ConfigItem = {
        id: this.id || '', // Use the existing ID if in edit mode, otherwise leave it empty
        name: formValue.name,
        type: formValue.type,
        description: '', // Add description if needed
        isActive: true, // Default to active
      };

      const operation = this.isEditMode
        ? this.adminService.updateConfig(item)
        : this.adminService.createConfig(item);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `${this.type} ${
              this.isEditMode ? 'updated' : 'created'
            } successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/admin']);
        },
        error: () => {
          this.snackBar.open(
            `Error ${this.isEditMode ? 'updating' : 'creating'} ${this.type}`,
            'Close',
            { duration: 3000 }
          );
        },
      });
    }
  }
}
