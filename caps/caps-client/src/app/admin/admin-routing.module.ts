import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminConfigComponent } from './admin-config/admin-config.component';
import { AdminConfigFormComponent } from './admin-config-form/admin-config-form.component';

const routes: Routes = [
  {
    path: '',
    component: AdminConfigComponent,
  },
  {
    path: 'create',
    component: AdminConfigFormComponent,
  },
  {
    path: 'edit/:type/:id',
    component: AdminConfigFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
