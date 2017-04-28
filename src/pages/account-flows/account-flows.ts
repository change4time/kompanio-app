import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { DataService } from '../../providers/data-service';
import { UniversalService } from '../../providers/universal-service';

/*
  Generated class for the Flows page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account-flows',
  templateUrl: 'account-flows.html'
})
export class AccountFlowsPage {
  private personalAccount: boolean;
  private accountId: string;
  private flows: any = [];
  private total: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: DataService, private loadingCtrl: LoadingController, private universal : UniversalService) {
    this.accountId = navParams.get('accountId');
    this.personalAccount = !this.accountId.startsWith("G");
    
    let loading = this.loadingCtrl.create({ content: "Chargement..." });
    loading.present();
    
    let query = { query: { orderByChild:'end', equalsTo: 'never' } };
    this.data.list('/accounts/'+this.accountId+'/flows', query).subscribe((data) => {
      this.flows = data;
      loading.dismiss();
      for(let f of this.flows) {
        this.total += f.amount;
      }
    });
  }
}
