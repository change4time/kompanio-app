import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AuthService } from '../providers/auth-service';

import { AuthPage } from '../pages/auth/home/home';
import { RegisterPage } from '../pages/auth/register/register';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = AuthPage;

  constructor(platform: Platform, translate: TranslateService, private auth: AuthService) {
    platform.ready().then(() => {
      this.auth.userObservable.subscribe((user) => {
        if (user) {
            this.nav.setRoot(HomePage);
        } else {
            this.nav.setRoot(RegisterPage);
        }
      });
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    translate.setDefaultLang('fr');
    translate.use('fr');
  }
}
