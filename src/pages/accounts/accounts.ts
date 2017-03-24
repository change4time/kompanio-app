import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DataService } from '../../providers/data-service';
import { AuthService } from '../../providers/auth-service';

import moment from 'moment';

@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html'
})
export class AccountsPage {
  currentBalance: any = 0;
  authorizations: any;
  fromNow: any;
  
  constructor(public navCtrl: NavController, private auth: AuthService, private data: DataService) {
    if(this.auth.account) {
        this.fromNow = moment(this.auth.account.balanceUpdated).fromNow();
        let since = moment().diff(moment(this.auth.account.balanceUpdated));
        /*
        let ur = moment().diff(moment(this.auth.account.balanceUpdated));
        console.log("Universal Revenu : " + ur);
        let ut = Math.round(0.8 * ur);
        console.log("Universal Tax : " + ut);
        this.userBalance = ur - ut + this.auth.account.dividend + this.auth.account.balance;

        this.currentBalance = this.auth.account.speed * since;
        */
    }
  }
  
  compute() {
    
  }
  
  toTime(balance) {
    return Math.round(moment.duration(balance).asHours());
  }

}
