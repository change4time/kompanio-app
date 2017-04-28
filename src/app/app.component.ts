import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AuthService } from '../providers/auth-service';

import { LoadingPage } from '../pages/loading/loading';
import { AuthPage } from '../pages/auth/auth';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = LoadingPage;

  constructor(platform: Platform, translate: TranslateService, private auth: AuthService, public loadingCtrl: LoadingController) {
    platform.ready().then(() => {
      auth.subscribe(state => {
        if (state) {
          this.nav.setRoot(HomePage);
        } else {
          this.nav.setRoot(AuthPage);
        }
        StatusBar.styleDefault();
        Splashscreen.hide();
      });
    });
    translate.setDefaultLang('fr');
    translate.use(translate.getBrowserLang());
  }
}
