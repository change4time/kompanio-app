import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { SendPage } from './send/send';

@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html'
})
export class PaymentsPage {

  constructor(public navCtrl: NavController) {

  }
  
  send() {
    this.navCtrl.push(SendPage)
  }

}
