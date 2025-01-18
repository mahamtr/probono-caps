import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentsListComponent } from './components/agents-list/agents-list.component';
import { AgentEditComponent } from './components/agent-edit/agent-edit.component';
import { AgentCreateComponent } from './components/agent-create/agent-create.component';

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
