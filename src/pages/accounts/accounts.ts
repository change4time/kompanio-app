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
  userAccount: any = null;
  accounts: any = [];
  authorizations: any;
  fromNow: any;
  
  constructor(public navCtrl: NavController, private auth: AuthService, private data: DataService) {
    // Subscribe to the user personal account
    if(this.auth.user.accountId)
        this.data.object('/accounts/'+this.auth.user.accountId).subscribe((account) => { 
            this.userAccount = account;
            this.fromNow = moment(account.balanceUpdated).fromNow();
            this.compute();
        });
    
    // Subscribe to user authorisations
    this.authorizations = this.data.list('/authorizations/'+this.auth.uid);
    this.authorizations.subscribe((auths) => {
        this.accounts = [];
        for(let authorization of auths) {
           if(authorization.read) { // If we can read this account
               // Subscribe to each authorized accounrs
               this.data.object('/accounts/'+authorization.$key).subscribe((account) => {
                this.accounts.push(account);
               });
           }
        }
    });
  }
  
  compute() {
    let since = moment().diff(moment(this.userAccount.balanceUpdated));
    /*
    let ur = moment().diff(moment(this.userAccount.balanceUpdated));
    console.log("Universal Revenu : " + ur);
    let ut = Math.round(0.8 * ur);
    console.log("Universal Tax : " + ut);
    this.userBalance = ur - ut + this.userAccount.dividend + this.userAccount.balance;
    */
    this.currentBalance = this.userAccount.speed * since;
  }
  
  toTime(balance) {
    return Math.round(moment.duration(balance).asHours());
  }

}
