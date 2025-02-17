import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsListComponent } from './patients-list/patients-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';

const routes: Routes = [
  {
    path: '',
    component: PatientsListComponent,
  },
  {
    path: 'create',
    component: PatientFormComponent,
  },
  {
    path: 'edit/:id',
    component: PatientFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
