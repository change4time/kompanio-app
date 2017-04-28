import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController } from 'ionic-angular';

import { DataService, DelegationModel } from '../../providers/data-service';
import { AuthService } from '../../providers/auth-service';

import { AccountChooserPage } from '../account-chooser/account-chooser';
import { DelegationDetailsPage } from '../delegation-details/delegation-details';

/*
  Generated class for the Delegations page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-delegations',
  templateUrl: 'delegations.html'
})
export class DelegationsPage {
  private accountId: string;
  private accountName: string;
  private canUpdate: boolean;
  private delegations: any = null;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private data: DataService, private loadingCtrl: LoadingController, public modalCtrl: ModalController, private auth: AuthService, public toastCtrl: ToastController) {
    this.accountId = navParams.get('accountId');
    this.accountName = navParams.get('accountName');
    this.canUpdate = navParams.get('canUpdate');
    
    let loading = this.loadingCtrl.create({ content: "Chargement..." });
    loading.present();
    
    this.data.list('/accounts/'+this.accountId+'/delegations').subscribe((data) => {
      this.delegations = data;
      loading.dismiss();
    });
  }
  
  add() {
    let profileModal = this.modalCtrl.create(AccountChooserPage, { type: 'external', card: false, groups: false, disableItemId: this.accountId });
    profileModal.onDidDismiss(account => {
      if(account) {
        let delegation = new DelegationModel(account.id, this.auth.user.name, account.name);
        this.update(delegation);
      }
    });
    profileModal.present();
  }
  
  update(delegation) {
    let profileModal = this.modalCtrl.create(DelegationDetailsPage, { delegation, accountId: this.accountId });
    profileModal.present();
  }
  
  delete(delegation) {
    this.data.remove('accounts/'+this.accountId+'/delegations/'+delegation.$key).then(snap => {}, error => { this.toast(error); });
  }
  
  toast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
