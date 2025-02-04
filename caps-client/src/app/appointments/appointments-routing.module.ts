import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentCreateComponent } from './appointment-create/appointment-create.component';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentListComponent,
  },
  {
    path: 'create',
    component: AppointmentCreateComponent,
  },
  {
    path: 'edit/:id',
    component: AppointmentEditComponent,
  },
  {
    path: 'calendar',
    component: AppointmentCalendarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
