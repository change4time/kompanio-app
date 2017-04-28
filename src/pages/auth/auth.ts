import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'auth.html'
})
export class AuthPage {

  error: string = "";
  credentials:any = { email: null, password: null };
  signInForm:boolean = false;

  constructor(public navCtrl: NavController, private auth: AuthService) {
  }

  signIn(): void {
    this.signInForm = true;
  }
  
  signUp(): void {
    this.navCtrl.push(RegisterPage);
  }
  
  signInWithEmail(): void {
    this.auth.signInWithEmail(this.credentials).then(authData => {
        this.error = "Connecting...";
    }).catch(e => {
        this.error = e.message;
    });
  }
}