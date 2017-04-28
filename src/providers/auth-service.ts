import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFire, AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';

import { Platform } from 'ionic-angular';
import { Facebook } from 'ionic-native';

import {DataService, UserModel} from './data-service';

@Injectable()
export class AuthService {
  private authState: FirebaseAuthState = null;
  private _user: UserModel = null;
  
  constructor(private af: AngularFire, private auth: AngularFireAuth, private platform: Platform, private data: DataService) {
  }
  
  subscribe(change) {
    return this.auth.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
      if(state) {
        this.data.user(state.uid).subscribe((user: UserModel) => {
          this._user = user;
          change(this);
          this.data.account(state.uid).subscribe(account => user.account = account);
          for(let delegation of user.delegations) {
            this.data.account(delegation.$key).subscribe(account => delegation.account = account);
          }
        });
      } else {
        this._user = null;
        change(null);
      }
    });
  }
  
  get photoURL(): string {
    return this.authState !== null ? this.authState.auth.photoURL : null;
  }
  
  get email(): string {
    return this.authState !== null ? this.authState.auth.email : null;
  }
  
  get uid(): string {
    return this.authState !== null ? this.authState.uid : null;
  }
  
  get name(): string {
    return this.authState !== null ? this.authState.auth.displayName : null;
  }
  
  get user(): UserModel {
    return this._user;
  }

  signOut(): void {
    this.auth.logout();
  }

  createUser(credentials: any) {
    return this.auth.createUser(credentials);
  }
  
  registerUser(email: string, password: string, user: UserModel) {
    return this.data.post('createUser', { email: email, password: password, data: user });
  }
  
  saveUser(user: UserModel) {
    return this.data.update('users/'+this.authState.uid+'/contact', user.contact);
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