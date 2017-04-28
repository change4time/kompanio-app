import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';
import { DataService, Payment } from '../../providers/data-service';
import { AuthService } from '../../providers/auth-service';
import { AccountChooserPage } from '../account-chooser/account-chooser';
import { AuthorizationPage } from '../authorization/authorization';

@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html'
})
export class PayPage {
  error: string = null;
  payment: any = null;
  paymentId: string = null;
  fromAccount: any;
  toAccount: any;
  fromLabel: string = null;
  toLabel: string = null;
  amount: number;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private data: DataService, private auth: AuthService, translate: TranslateService) {
    let accountId = navParams.get('accountId');
    if(accountId == auth.user.account.id) {
      this.fromAccount = auth.user;
    }
    translate.get('PAYMENT').subscribe(res => {
    });
  }
  
  selectFromAccount() {
    let profileModal = this.modalCtrl.create(AccountChooserPage, { type: 'internal', card: true, groups: true });
    profileModal.onDidDismiss(account => {
      if(account) {
        this.toAccount = null;
        this.fromAccount = account;
      }
    });
    profileModal.present();
  }
  
  selectToAccount() {
    let options = {};
    if(this.fromAccount.type == 'card') {
      options = { type: 'internal', card: true, resolveCard: true, groups: true };
    } else if(this.fromAccount) {
      options = { type: 'external', card: true, resolveCard: true, groups: true, disableItemId: this.fromAccount.id  };
    }
    let profileModal = this.modalCtrl.create(AccountChooserPage, options);
    profileModal.onDidDismiss(account => {
      if(account) {
        this.toAccount = account;
      }
    });
    profileModal.present();
  }
  
  modifyPayment() {
    this.payment = null;
  }
  
  confirmPayment() {
    if(this.fromAccount.type == 'card') {
      this.payment = new Payment(null, null, this.toAccount, this.amount);
      this.payment.from.label = 'PAIEMENT CARTE ' + this.toAccount.name.toUpperCase();
      this.payment.to.label = this.toLabel ? this.toLabel.toUpperCase() : 'PAIEMENT ' + this.fromAccount.name.toUpperCase();
      this.payment.authorization = { type:'card', card:this.fromAccount.id, signature: null };
      
      this.authPayment();
    } else {
      this.payment = new Payment(this.auth, this.fromAccount, this.toAccount, this.amount);
      this.payment.from.label = this.fromLabel ? this.fromLabel.toUpperCase() : 'VIR ' + this.toAccount.name.toUpperCase();
      this.payment.to.label = this.toLabel ? this.toLabel.toUpperCase() : 'VIR ' + this.fromAccount.name.toUpperCase();
    }
  }
  
  authPayment() {
    let profileModal = this.modalCtrl.create(AuthorizationPage, { payment: this.payment });
    profileModal.onDidDismiss(auth => {
      if(auth.error)
        this.error = auth.error;
      else {
        this.payment.authorization.signature = auth.signature;
        this.submitPayment();
      }
    });
    profileModal.present(); 
  }
  
  retry() {
    if(this.fromAccount.type == 'card' && this.payment.authorization.signature == null) {
      this.authPayment();
    } else {
      this.submitPayment();
    }
  }
  
  submitPayment() {
    console.log(this.payment);
    this.data.push('/payments', this.payment).subscribe(key => {
      console.log("Payment created with key ", key);
      this.payment = null;
      this.paymentId = key;
    }, error => {
      this.error = error.message;
    });
  }
  
  home() {
    this.navCtrl.pop();
  }
}
