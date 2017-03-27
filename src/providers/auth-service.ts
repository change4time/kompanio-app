import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFire, AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';

import { Platform } from 'ionic-angular';
import { Facebook } from 'ionic-native';

import {DataService} from './data-service';

@Injectable()
export class AuthService {
  private authState: FirebaseAuthState = null;
  
  constructor(private af: AngularFire, private auth: AngularFireAuth, private platform: Platform, private data: DataService) {
    this.auth.subscribe((state: FirebaseAuthState) => {
        this.authState = state;
    });
  }
  
  get uid(): string {
    return this.authState !== null ? this.authState.uid : null;
  }

  signOut(): void {
    this.auth.logout();
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