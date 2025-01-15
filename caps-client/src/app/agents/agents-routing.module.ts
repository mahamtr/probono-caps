import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentsListComponent } from './components/agents-list/agents-list.component';

const routes: Routes = [
  {
    path: '',
    component: AgentsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentsRoutingModule {}
