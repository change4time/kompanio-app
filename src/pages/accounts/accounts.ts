import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DataService } from '../../providers/data-service';
import { UserService } from '../../providers/user-service';

import moment from 'moment';

@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html'
})
export class AccountsPage {
  currentBalance: any = 0;
  authorizations: any;

  constructor(public navCtrl: NavController, private user: UserService, private data: DataService) {
  
  }
  
  compute() {
    
  }
  
  fromNow(date) {
    return moment(date).fromNow();
  }
  
  toTime(balance) {
    return Math.floor(moment.duration(balance).asHours());
  }

}
