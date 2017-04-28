import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ProfilePage } from '../profile/profile';
import { CardsPage } from '../cards/cards';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, private auth: AuthService) {

  }
  
  disconnect() {
    this.auth.signOut();
  }
  
  profile() {
    this.navCtrl.push(ProfilePage);
  }

  cards() {
    this.navCtrl.push(CardsPage);
  }
}
