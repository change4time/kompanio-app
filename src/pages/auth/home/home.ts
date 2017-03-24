import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../../providers/auth-service';

import { HomePage } from '../../home/home';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class AuthPage {

  error: string = "";
  credentials:any = { email: null, password: null };
  signInForm:boolean = false;
  signUpForm:boolean = false;

  constructor(public navCtrl: NavController, private auth: AuthService) {
  }
  
  signInWithEmail(): void {
    this.auth.signInWithEmail(this.credentials).then(authData => {
        this.navCtrl.setRoot(RegisterPage);
    }).catch(e => {
        this.error = e.message;
    });
  }
  
  signUpWithEmail(): void {
    this.auth.createUser(this.credentials).then(authData => {
        this.navCtrl.push(RegisterPage);
    }).catch(e => {
        this.error = e.message;
    });
  }

  signIn(): void {
    this.signInForm = true;
  }
  
  signUp(): void {
    this.signUpForm = true;
  }
  
  signOut(): void {
    this.auth.signOut();
    this.navCtrl.push(HomePage);
  }
}