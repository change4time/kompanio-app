import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { UserService } from '../providers/user-service';

import { AuthPage } from '../pages/auth/auth';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = AuthPage;

  constructor(platform: Platform, translate: TranslateService, private user: UserService) {
    platform.ready().then(() => {
      this.user.observable.subscribe(user => {
        if (user) {
            if(user.identity) {
              this.nav.setRoot(HomePage);
            } else {
              this.nav.setRoot(ProfilePage);
            }
        } else {
            this.nav.setRoot(AuthPage);
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
