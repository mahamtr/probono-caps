import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import { DeleteConfirmationModalComponent } from './components/delete-confirmation-modal/delete-confirmation-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './components/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from './auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IdInputComponent } from './components/id-input/id-input.component';
import { StateInputComponent } from './components/state-input/state-input.component';
import { MatSelectModule } from '@angular/material/select';

//TODO check which modules are not needed

var modules = [
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  CommonModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  MatDialogModule,
  ReactiveFormsModule,
  HttpClientModule,
  MatSelectModule,

  MatCardModule,
  MatFormFieldModule,
  MatInputModule, //
  MatButtonModule, //
  MatIconModule, //

  RouterModule,
  MatSnackBarModule,
];

@NgModule({
  declarations: [
    SideNavComponent,
    DeleteConfirmationModalComponent,
    LoginComponent,
  ],
  imports: [modules],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class SharedModule {}
