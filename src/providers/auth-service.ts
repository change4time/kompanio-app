import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AngularFire, AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods, FirebaseObjectObservable } from 'angularfire2';

import { Platform } from 'ionic-angular';
import { Facebook } from 'ionic-native';

import {DataService} from './data-service';

@Injectable()
export class AuthService {
  public userObservable: Observable<any>;
  public waiting: boolean = true;
  private observer: Observer<any> = null;
  private fbUser: FirebaseObjectObservable<any>;
  private authState: FirebaseAuthState = null;

  public user: any = null;
  public account: any = null;
  public accounts: any = [];
  
  constructor(private af: AngularFire, private auth: AngularFireAuth, private platform: Platform, private data: DataService) {
    this.userObservable = Observable.create(observer => this.observer = observer);
    this.auth.subscribe((state: FirebaseAuthState) => {
        this.authState = state;
        if (state) {
            this.fbUser = this.data.object('users/' + state.uid);
            this.fbUser.subscribe(userData => {
              if(userData.identity != null) {
                this.user = userData;
                this.observer.next(this.user);
                    
                /* Subscribe to user personal account */
                if(this.user.accountId && !this.account) {
                    this.data.object('/accounts/'+this.user.accountId).subscribe((account) => { 
                        this.account = account;
                    });
                }
                  
                /* Subscribe to user authorised account */
                if(this.user.delegations != null) {
                    for(let id in this.user.delegations) {
                       let delegation = this.user.delegations[id];
                       if(this.getAccountIndex(delegation.$key) === null) {
                           // Subscribe to each authorized accounts
                           this.data.object('/accounts/'+id).subscribe((account) => {
                               let i = this.getAccountIndex(account.$key);
                               if(i === null)
                                   this.accounts.push(account);
                                else
                                   this.accounts[i] = account;
                           });
                       }
                    }
                }
              } else {
                this.observer.next(this.user);
              }
            });
        } else {
            this.waiting = false;
        }
    });
  }
  
  get uid(): string {
    return this.authState !== null ? this.authState.uid : null;
  }

  signOut(): void {
    this.auth.logout();
  }

    getAccountIndex(key) {
        for(let i in this.accounts) {
            if(this.accounts[i].$key == key) {
                return i;
            }
        }
        return null;
    }

  createUser(credentials: any) {
    return this.auth.createUser(credentials);
  }
  
  registerUserIdentity(data: any) {
    return this.data.object('users/' + this.authState.uid+'/identity').set(data);
  }

  signInWithEmail(credentials) {
    return this.auth.login(credentials, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      });
  }

  loginWithFacebook() {
    return Observable.create(observer => {
      if (this.platform.is('cordova')) {
        Facebook.login(['public_profile', 'email']).then(facebookData => {
          let provider = firebase.auth.FacebookAuthProvider.credential(facebookData.authResponse.accessToken);
          firebase.auth().signInWithCredential(provider).then(firebaseData => {
            this.af.database.list('users').update(firebaseData.uid, {
              name: firebaseData.displayName,
              email: firebaseData.email,
              provider: 'facebook',
              image: firebaseData.photoURL
            });
            observer.next();
          });
        }, error => {
          observer.error(error);
        });
      } else {
        this.af.auth.login({
          provider: AuthProviders.Facebook,
          method: AuthMethods.Popup
        }).then((facebookData) => {
          this.af.database.list('users').update(facebookData.auth.uid, {
            name: facebookData.auth.displayName,
            email: facebookData.auth.email,
            provider: 'facebook',
            image: facebookData.auth.photoURL
          });
          observer.next();
        }).catch((error) => {
          console.info("error", error);
          observer.error(error);
        });
      }
    });
  }

  sendPasswordResetEmail(email) {
    return Observable.create(observer => {
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        observer.next();
        // Email sent.
      }, function(error) {
        observer.error(error);
        // An error happened.
      });
    });
  }
}