import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientsRoutingModule } from './patients-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { IdInputComponent } from '../shared/components/id-input/id-input.component';
import { StateInputComponent } from '../shared/components/state-input/state-input.component';

@NgModule({
  declarations: [
    PatientsListComponent,
    PatientFormComponent,
    IdInputComponent,
    StateInputComponent,
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatGridListModule,
    MatRadioModule,
  ],
})
export class PatientsModule {}
