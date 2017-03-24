import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { DataService } from '../../../providers/data-service';
import { AuthService } from '../../../providers/auth-service';

@Component({
  templateUrl: 'send.html'
})
export class SendPage {
  error: string = null;
  search: string = "";
  payment: any = { from:null, to:null, amount:0 };
  
  constructor(public navCtrl: NavController, private auth: AuthService, private data: DataService) {
  }
  
  send() {
    this.payment.amount = parseInt(this.payment.amount) * 3600 * 1000;
    console.log("Send payment ", this.payment);
    this.data.push('/payments', this.payment).subscribe(key => {
        console.log("Payment created with key ", key);
        this.payment.key = key;
    }, error => {
        this.error = error.message;
    });
  }

}