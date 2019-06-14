import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'accounts',
        children: [
          {
            path: '',
            loadChildren: './accounts/accounts.module#AccountsPageModule'
          }
        ]
      },
      {
        path: 'network',
        children: [
          {
            path: '',
            loadChildren: './network/network.module#NetworkPageModule'
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: './settings/settings.module#SettingsPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/accounts',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/accounts',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
