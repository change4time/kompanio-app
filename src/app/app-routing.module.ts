import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule' },
  { path: 'logout', loadChildren: './public/login/login.module#LoginPageModule' },
  { path: 'accounts', loadChildren: './home/accounts/accounts.module#AccountsPageModule' },
  { path: 'network', loadChildren: './home/network/network.module#NetworkPageModule' },
  { path: 'settings', loadChildren: './home/settings/settings.module#SettingsPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
