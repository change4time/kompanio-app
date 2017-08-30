import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';

import { DataService } from '../../providers/data-service';
import { AuthService } from '../../providers/auth-service';

import { DelegationsPage } from '../delegations/delegations';
import { AccountPaymentsPage } from '../account-payments/account-payments';
import { AccountFlowsPage } from '../account-flows/account-flows';

import { PayPage } from '../pay/pay';

import moment from 'moment';

@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html'
})
export class AccountsPage {
  currentBalance: any = 0;
  authorizations: any;
  totalName: string = 'TODAY';
  totalBalance: number = 0;

  constructor(public navCtrl: NavController, private auth: AuthService, private data: DataService, public actionSheetCtrl: ActionSheetController) {
    if(this.auth.uid) {
      let query = { query: { orderByChild: 'created', startAt:moment().subtract(1, 'days').startOf('day').valueOf(), endAt:moment().endOf('day').valueOf() } };
      this.data.list('accounts/'+auth.uid+'/payments', query).subscribe(data => {
        let today = moment().startOf('day').valueOf();
        let yesterday = 0;
        for(let payment of data) {
          if(payment.created < today)
            yesterday += payment.amount;
          else
            this.totalBalance += payment.amount;
        }
        if(!this.totalBalance) {
          this.totalName = 'YESTERDAY';
          this.totalBalance = yesterday;
        }
      });
    }
  }
  
  action(delegation) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Compte ' + delegation.name,
      buttons: [
        {
          text: 'Opérations',
          handler: () => {
            this.details(delegation.$key);
          }
        },{
          text: 'Flux',
          handler: () => {
            this.flows(delegation.$key);
          }
        },{
          text: 'Delegations',
          handler: () => {
            this.delegations(delegation.$key, delegation.name, delegation.manage);
          }
        },{
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }
  
  fromNow(date) {
    return moment(date).fromNow();
  }
  
  details(accountId) {
    this.navCtrl.push(AccountPaymentsPage, {accountId});
  }

  delegations(accountId, accountName, canUpdate) {
    this.navCtrl.push(DelegationsPage, {accountId, accountName, canUpdate});
  }

  flows(accountId) {
    this.navCtrl.push(AccountFlowsPage, {accountId});
  }
  
  payments(accountId) {
    this.navCtrl.push(PayPage, {accountId});
  }
}
