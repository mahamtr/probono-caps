import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideNavComponent } from './shared/components/side-nav/side-nav.component';

const routes: Routes = [
  {
    path: '',
    component: SideNavComponent,
    children: [
      {
        path: 'agents',
        loadChildren: () =>
          import('./agents/agents.module').then((m) => m.AgentsModule),
      },
      // {
      //   path: 'bedroom',
      //   loadChildren: () =>
      //     import('./bedroom/bedroom.module').then((m) => m.BedroomModule),
      // },
      // {
      //   path: 'kitchen',
      //   loadChildren: () =>
      //     import('./kitchen/kitchen.module').then((m) => m.KitchenModule),
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
