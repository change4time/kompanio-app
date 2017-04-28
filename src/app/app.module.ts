import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Http} from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { AngularFireModule } from 'angularfire2';

/* Pipes */
import { Time } from '../pipes/time';
import { OrderBy } from '../pipes/order-by';
import { PhotoURL } from '../pipes/photo-url';

/* Services */
import { AuthService } from '../providers/auth-service';
import { AccountsService } from '../providers/accounts-service';
import { DataService } from '../providers/data-service';
import { UniversalService } from '../providers/universal-service';

/* Home */
import { MyApp } from './app.component';
import { LoadingPage } from '../pages/loading/loading';
import { AuthPage } from '../pages/auth/auth';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';

/* Accounts */
import { AccountsPage } from '../pages/accounts/accounts';
import { AccountPaymentsPage } from '../pages/account-payments/account-payments';
import { AccountFlowsPage } from '../pages/account-flows/account-flows';

import { PayPage } from '../pages/pay/pay';
import { DelegationsPage } from '../pages/delegations/delegations';
import { DelegationDetailsPage } from '../pages/delegation-details/delegation-details';
import { AccountChooserPage } from '../pages/account-chooser/account-chooser';
import { AuthorizationPage } from '../pages/authorization/authorization';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/* Map */
import { MapPage } from '../pages/map/map';

/* Settings */
import { SettingsPage } from '../pages/settings/settings';
import { ProfilePage } from '../pages/profile/profile';
import { CardsPage } from '../pages/cards/cards';



export const firebaseConfig = {
  apiKey: "AIzaSyDoKM_Qc8J0xUIjA38bcb-M091OKWkloSU",
  authDomain: "bank4time.firebaseapp.com",
  databaseURL: "https://bank4time.firebaseio.com",
  storageBucket: "bank4time.appspot.com",
  messagingSenderId: "992072830135"
};

@NgModule({
  declarations: [
    Time,
    OrderBy,
    PhotoURL,
    
    MyApp,
    LoadingPage,
    AuthPage,
    HomePage,
    RegisterPage,
    
    AccountsPage,
    AccountPaymentsPage,
    AccountFlowsPage,
    
    PayPage,
    DelegationsPage,
    DelegationDetailsPage,
    AccountChooserPage,
    AuthorizationPage,
    
    MapPage,
    
    SettingsPage,
    ProfilePage,
    CardsPage
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
    LoadingPage,
    AuthPage,
    HomePage,
    RegisterPage,
    
    AccountsPage,
    AccountPaymentsPage,
    AccountFlowsPage,
    
    PayPage,
    DelegationsPage,
    DelegationDetailsPage,
    AccountChooserPage,
    AuthorizationPage,
    
    MapPage,
    
    SettingsPage,
    ProfilePage,
    CardsPage
  ],
  providers: [AuthService, AccountsService, DataService, UniversalService, BarcodeScanner, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}