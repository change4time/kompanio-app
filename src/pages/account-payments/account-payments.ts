import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../providers/data-service';

import moment from 'moment';

/*
  Generated class for the AccountDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account-payments',
  templateUrl: 'account-payments.html'
})
export class AccountPaymentsPage {
  public accountId: string;

  public groups: any[] = [];
  private currentGroup: any = null;
  
  private limitSubject: Subject<any>;
  private infiniteScroll: any;
  private loadSize: number = 8;
  private limit: number = 8;

  private endTime: number= Date.now();
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private data: DataService, private loadingCtrl: LoadingController) {
    this.accountId = navParams.get('accountId');
    
    let loading = this.loadingCtrl.create({ content: "Chargement..." });
    loading.present();
    
    this.limitSubject = new Subject();

    let query = { query: { orderByChild:'created', limitToLast: this.limitSubject } };//, endAt: this.endAtSubject
    this.data.list('/accounts/'+this.accountId+'/payments', query).subscribe((data) => {
      this.limit = data.length;
      this.groups = [];
      this.currentGroup = null;
      this.populate(data);
      
      if(this.infiniteScroll) {
        this.infiniteScroll.complete();
        this.infiniteScroll = null;
      } else if(loading) {
        loading.dismiss();
        loading = null;
      }
    });
    
    this.limitSubject.next(this.limit);
  }
  
  populate(data) {
    for(let payment of data) {
      let date = moment(payment.created).startOf('day').valueOf();
      if(!this.currentGroup || this.currentGroup.date != date) {
        this.currentGroup = {
          date: date,
          payments:[payment]
        };
        this.groups.push(this.currentGroup);
      } else {
        this.currentGroup.payments.push(payment);
      }
      this.endTime = payment.created;
    }
  }
  
  loadMore(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.limit += this.loadSize;
    this.limitSubject.next(this.limit);
  }
}
