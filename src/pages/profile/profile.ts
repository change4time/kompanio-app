import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { DataService } from '../../providers/data-service';

import { Camera } from 'ionic-native';

@Component({
  templateUrl: 'profile.html'
})
export class ProfilePage {
    loader;
    alertCtrl: AlertController;
    captureDataUrl: string;
    user: any = null;
    error: string = null;

  constructor(public navCtrl: NavController, private auth: AuthService, private data: DataService, alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.alertCtrl = alertCtrl;
    this.user = this.auth.user;
  }
  
  openGallery (): void {
      let cameraOptions = {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.DATA_URL,
        quality: 100,
        targetWidth: 128,
        targetHeight: 128,
        encodingType: Camera.EncodingType.JPEG,      
        correctOrientation: true
      }

      Camera.getPicture(cameraOptions).then(imageData => {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...'
            });

            loading.present();
            this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
            this.data.upload("photos/"+this.auth.uid+".jpg", this.captureDataUrl).then((snapshot) => {
                this.user.photoURL = snapshot.downloadURL;
                loading.dismiss();
            },
            err => this.showUploadAlert(err.message));
        }, 
        err => this.showUploadAlert(err.message));   
    }
    
    save() {
      this.auth.saveUser(this.user).then(() => {
        this.error = "Saved !";
      }).catch((error) => {
        this.error = error.message;
      });
    }
    
    showUploadAlert(message: string) {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
      }
}