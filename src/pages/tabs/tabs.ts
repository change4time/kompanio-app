import { Component } from '@angular/core';

import { AccountsPage } from '../accounts/accounts';
import { PaymentsPage } from '../payments/payments';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = AccountsPage;
  tab2Root: any = PaymentsPage;
  tab3Root: any = SettingsPage;

  constructor() {

  }
}
