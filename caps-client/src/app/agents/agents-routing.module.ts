import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentsListComponent } from './agents-list/agents-list.component';
import { AgentEditComponent } from './agent-edit/agent-edit.component';
import { AgentCreateComponent } from './agent-create/agent-create.component';

const routes: Routes = [
  {
    path: '',
    component: AgentsListComponent,
  },
  {
    path: 'create',
    component: AgentCreateComponent,
  },
  {
    path: 'edit/:id',
    component: AgentEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentsRoutingModule {}
