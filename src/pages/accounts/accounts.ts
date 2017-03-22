import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html'
})
export class AccountsPage {
  userAccount: FirebaseObjectObservable<any>;
  accounts: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, af: AngularFire) {
    this.accounts = af.database.list('/accounts');
    this.userAccount = af.database.object('/accounts/003');
  }

}
