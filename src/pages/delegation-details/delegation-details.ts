import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { DataService } from '../../providers/data-service';

/*
  Generated class for the DelegationDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-delegation-details',
  templateUrl: 'delegation-details.html'
})
export class DelegationDetailsPage {
  private delegation: any = null;
  private accountId: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, private data: DataService) {
    this.accountId = navParams.get('accountId');
    this.delegation = navParams.get('delegation');
  }
  
  save() {
    this.data.set('accounts/'+this.accountId+'/delegations/'+this.delegation.$key, this.delegation).then(snap => {
      this.viewCtrl.dismiss(snap);
    }, error => {
      this.toast(error);
    });
  }
  
  toast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
