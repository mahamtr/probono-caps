import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DeleteConfirmationModalComponent } from './components/delete-confirmation-modal/delete-confirmation-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './components/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from './auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StateInputComponent } from './components/state-input/state-input.component';
import { MatSelectModule } from '@angular/material/select';
import { IdInputComponent } from './components/id-input/id-input.component';

var modules = [
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  CommonModule,
  MatDialogModule,
  ReactiveFormsModule,
  HttpClientModule,
  MatSelectModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  RouterModule,
  MatSnackBarModule,
];

@NgModule({
  declarations: [
    SideNavComponent,
    DeleteConfirmationModalComponent,
    LoginComponent,
    StateInputComponent,
    IdInputComponent,
  ],
  imports: [modules],
  exports: [StateInputComponent, IdInputComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class SharedModule {}
