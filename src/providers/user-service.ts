import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AngularFire, AngularFireAuth, FirebaseObjectObservable } from 'angularfire2';

import { DataService } from './data-service';
import { UniversalService } from './universal-service';

import moment from 'moment';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {
  public observable: Observable<any>;
  private observer: Observer<any> = null;
  private fbUser: FirebaseObjectObservable<any>;

  public rtBalance: number = 0;
  public identity: any = {};
  public account: any = null;
  public accounts: any = [];
  
  constructor(private af: AngularFire, private auth: AngularFireAuth, private data: DataService, private us: UniversalService) {
    this.observable = Observable.create(observer => this.observer = observer);
    this.auth.subscribe(auth => {
        if (auth) {
            this.fbUser = this.data.object('users/' + auth.uid);
            this.fbUser.subscribe(userData => {
              this.observer.next(userData);
              if(userData.identity) {
                this.identity = userData.identity;
                    
                /* Subscribe to user personal account */
                if(userData.accountId && !this.account) {
                    this.data.object('/accounts/'+userData.accountId).subscribe((account) => { 
                      account.getRealTimeBalance = this.getRealTimeBalance.bind(this, account);
                      this.account = account;
                    });
                }
                  
                /* Subscribe to user authorised account */
                if(userData.delegations != null) {
                    for(let id in userData.delegations) {
                       let delegation = userData.delegations[id];
                       if(this.getAccountIndex(delegation.$key) === null) {
                           // Subscribe to each authorized accounts
                           this.data.object('/accounts/'+id).subscribe((account) => {
                               let i = this.getAccountIndex(account.$key);
                               account.getRealTimeBalance = this.getRealTimeBalance.bind(this, account);
                               if(i === null)
                                   this.accounts.push(account);
                                else
                                   this.accounts[i] = account;
                           });
                       }
                    }
                }
              }
            });
        } else {
          this.observer.next(null);
        }
    });
  }

  getAccountIndex(key) {
    for(let i in this.accounts) {
      if(this.accounts[i].$key == key) {
        return i;
      }
    }
    return null;
  }
  
  getRealTimeBalance(account: any) {
    let since = moment().diff(moment(account.upcomingSpeedUpdated));
    let upcoming = since * account.upcomingSpeed;
    return account.balance + Math.floor(upcoming);
  }
}
