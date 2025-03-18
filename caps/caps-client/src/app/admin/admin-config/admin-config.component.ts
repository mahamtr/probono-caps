import { Component, OnInit } from '@angular/core';
import { AdminService, ConfigItem } from '../admin.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONFIG_TYPES } from 'src/app/constants/constants';

@Component({
  selector: 'app-admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss'],
})
export class AdminConfigComponent implements OnInit {
  majors$!: Observable<ConfigItem[]>;
  programs$!: Observable<ConfigItem[]>;
  diagnoses$!: Observable<ConfigItem[]>;
  displayedColumns: string[] = ['name', 'actions'];
  CONFIG_TYPES = CONFIG_TYPES;
  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Fetch all configs and filter by type
    this.majors$ = this.adminService.configs$.pipe(
      map((configs) =>
        configs.filter((config) => config.type === CONFIG_TYPES.MAJOR)
      )
    );

    this.programs$ = this.adminService.configs$.pipe(
      map((configs) =>
        configs.filter((config) => config.type === CONFIG_TYPES.PROGRAM)
      )
    );

    this.diagnoses$ = this.adminService.configs$.pipe(
      map((configs) =>
        configs.filter((config) => config.type === CONFIG_TYPES.DIAGNOSIS)
      )
    );

    // Ensure configs are loaded into memory
    this.adminService.fetchConfigs().subscribe();
  }

  openDeleteDialog(type: string, id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '300px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const deleteOperation = this.adminService.deleteConfig(id);

        if (deleteOperation) {
          deleteOperation.subscribe({
            next: () => {
              this.snackBar.open(`${type} successfully deleted`, 'Close', {
                duration: 3000,
              });
              this.loadData();
            },
            error: () => {
              this.snackBar.open(`Error deleting ${type}`, 'Close', {
                duration: 3000,
              });
            },
          });
        }
      }
    });
  }
}
