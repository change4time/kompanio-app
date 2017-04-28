import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {DataService} from './data-service';

import moment from 'moment';

/*
  Generated class for the UniversalService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UniversalService {
  public current: any;
  public balance: number;
  public flows: any = [];
  
  constructor(public http: Http, private data: DataService) {
    this.data.list('/universal', {
      query: {
        orderByKey: true,
        limitToLast: 1 
      }
    }).subscribe(universal => {
      if(universal.length > 0) {
        this.current = universal[0];
        this.balance = this.current.balance;
        this.flows = [];
        for(let id in this.current.flows) {
          this.current.flows[id].$key = id;
          this.flows.push(this.current.flows[id]);
        }
      }
    });
  }
  
  dividendFromDate(date: any) {
    let since = moment().diff(moment(date));
    console.log("Dividend at " + date + " : " + since);
    /*
      let ur = moment().diff(moment(this.user.account.balanceUpdated));
      console.log("Universal Revenu : " + ur);
      let ut = Math.round(0.8 * ur);
      console.log("Universal Tax : " + ut);
      this.userBalance = ur - ut + this.user.account.dividend + this.user.account.balance;
    */
    return since;
  }
  
  taxFromDate(date: any) {
    let since = moment().diff(moment(date));
    return since;
  }
  
  membersFromDate(date: any) {
    let since = moment().diff(moment(date));
    return since;
  }
  
  spentFromDate(date: any) {
    let since = moment().diff(moment(date));
    return since;
  }
  
  environmentFromDate(date: any) {
    let since = moment().diff(moment(date));
    return since;
  }
  
  activityFromDate(date: any) {
    let since = moment().diff(moment(date));
    return since;
  }
}
