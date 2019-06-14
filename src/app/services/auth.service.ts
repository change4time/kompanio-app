import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = null;

  constructor(public afAuth: AngularFireAuth) {
    afAuth.user.subscribe((user) => {
      this.user = user;
    });
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  get currentUserObservable(): any {
    return this.afAuth.user;
  }

  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  
  logout() {
    this.afAuth.auth.signOut();
  }

  signInWithEmail(credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }
/*
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
  }*/
}
