import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { DataService } from '../../providers/data-service';
import { AuthService } from '../../providers/auth-service';

import crypto from 'crypto';

/*
  Generated class for the AccountChooser page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-authorization',
  templateUrl: 'authorization.html'
})
export class AuthorizationPage {
  pin: number;
  payment: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private auth: AuthService, private data: DataService) {
    this.payment = navParams.get('payment');
  }
  
  cancel(error) {
    this.viewCtrl.dismiss({ error: error ? error : "Cancelled by user" });
  }
  
  return(signature) {
    this.viewCtrl.dismiss({ signature: signature });
  }
  
  confirm() {
    let message = this.payment.authorization.card+':'+this.payment.to.id+':'+this.payment.amount;
    this.payment.authorization.signature = crypto.createHmac('sha256', ''+this.pin).update(message).digest('base64');

    this.data.post('authorize', this.payment).then((result) => {
      console.log("Auth succeed");
      console.log(result);
      this.return(this.payment.authorization.signature);
    }, error => {
      console.log("Auth fail");
      console.log(error);
      if(error._body) {
        let data = JSON.parse(error._body);
        this.cancel("Authorization failed : " + data.message);
      } else
        this.return(this.payment.authorization.signature);
    });
  }
}
