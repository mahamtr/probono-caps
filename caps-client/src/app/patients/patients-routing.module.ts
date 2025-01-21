import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsListComponent } from './patients-list/patients-list.component';

const routes: Routes = [
  {
    path: '',
    component: PatientsListComponent,
  },
  //   {
  //     path: 'create',
  //     component: AgentCreateComponent,
  //   },
  //   {
  //     path: 'edit/:id',
  //     component: AgentEditComponent,
  //   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
