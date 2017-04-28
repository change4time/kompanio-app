import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { DataService, Identity } from '../../providers/data-service';
import { AuthService } from '../../providers/auth-service';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/*
  Generated class for the AccountChooser page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account-chooser',
  templateUrl: 'account-chooser.html'
})
export class AccountChooserPage {
  disableItemId: string;
  displayCard: boolean;
  resolveCard: boolean;
  displayGroups: boolean;
  card: any = { type:'card', id:null, name:"Carte", photoURL:"assets/img/card.jpg" };
  type: string;
  userAccounts: any = [];
  items: Identity = null;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private auth: AuthService, private data: DataService, private barcodeScanner: BarcodeScanner, public alertCtrl: AlertController) {
    this.displayCard = navParams.get('card');
    this.displayGroups = navParams.get('groups');
    this.resolveCard = navParams.get('resolveCard');
    this.type = navParams.get('type');
    this.disableItemId = navParams.get('disableItemId');
    
    this.userAccounts.push(auth.user);
    for(var delegation of this.auth.user.delegations) {
      this.userAccounts.push(delegation);
    }
    
    this.items = this.userAccounts;
  }
  
  select(item) {
    if(item.$key == this.disableItemId)
      return;
    this.viewCtrl.dismiss(item);
  }
  
  search(searchEvent) {
    let term = searchEvent.target.value
    // We will only perform the search if we have 3 or more characters
    if (!term || term.trim() === '' || term.trim().length < 3) {
      // Load cached users
      this.items = this.userAccounts;
    } else {
      // Get the searched users from github
      this.data.searchIdentities(term, this.displayGroups).then((identities) => {
        console.log("Identities found: ", identities);
        this.items = identities;
      });
    }
  }
  
  scanCard() {
    this.barcodeScanner.scan().then((barcodeData) => {
      console.log(barcodeData);
      console.log(barcodeData.text);
      this.card.id = barcodeData.text.split('/').pop();
      
      console.log(this.card.id);
      
      //var b = new Buffer('SmF2YVNjcmlwdA==', 'base64')
      //var s = b.toString();
            
      if(this.card.id) {
        if(this.resolveCard) {
          this.data.get('cardInfo?id='+this.card.id).then((result) => {
            console.log(result);
            this.viewCtrl.dismiss(result);
          }, error => {
            console.log(error);
            alert(error._body);
          });
        } else {
          this.viewCtrl.dismiss(this.card);
        }
      } else {
        alert("Invalid card");
      }
    }, (error) => {
        alert(error.message);
    });
  }
  
  alert(message: string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
