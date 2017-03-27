import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Http} from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../providers/auth-service';
import { UserService } from '../providers/user-service';
import { DataService } from '../providers/data-service';
import { UniversalService } from '../providers/universal-service';

import { MyApp } from './app.component';
import { AuthPage } from '../pages/auth/auth';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { AccountsPage } from '../pages/accounts/accounts';
import { PaymentsPage } from '../pages/payments/payments';
import { SettingsPage } from '../pages/settings/settings';
import { SendPage } from '../pages/payments/send/send';

export const firebaseConfig = {
  apiKey: "AIzaSyDoKM_Qc8J0xUIjA38bcb-M091OKWkloSU",
  authDomain: "bank4time.firebaseapp.com",
  databaseURL: "https://bank4time.firebaseio.com",
  storageBucket: "bank4time.appspot.com",
  messagingSenderId: "992072830135"
};

@NgModule({
  declarations: [
    MyApp,
    AuthPage,
    ProfilePage,
    HomePage,
    AccountsPage,
    PaymentsPage,
    SettingsPage,
    SendPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
      deps: [Http]
    }),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AuthPage,
    ProfilePage,
    HomePage,
    AccountsPage,
    PaymentsPage,
    SettingsPage,
    SendPage
  ],
  providers: [AuthService, UserService, DataService, UniversalService, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}