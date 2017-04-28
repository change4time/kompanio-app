import { Component } from '@angular/core';

import { AccountsPage } from '../accounts/accounts';
import { MapPage } from '../map/map';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = AccountsPage;
  tab2Root: any = MapPage;
  tab3Root: any = SettingsPage;

  constructor() {
  
  }
}
