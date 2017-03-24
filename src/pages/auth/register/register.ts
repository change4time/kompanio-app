import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../../providers/auth-service';
import { DataService } from '../../../providers/data-service';

import { Camera } from 'ionic-native';

import { HomePage } from '../../home/home';

@Component({
  templateUrl: 'register.html'
})
export class RegisterPage {
    loader;
    alertCtrl: AlertController;
    captureDataUrl: string;
    userID: string = null;
    user: any = {
        firstName: null,
        lastName: null,
        birthDate: null,
        phoneNumber: null,
        imageUrl: "http://www.freeiconspng.com/uploads/profile-icon-9.png"
    };

  constructor(public navCtrl: NavController, private auth: AuthService, private data: DataService, alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.alertCtrl = alertCtrl;
  }
  
  ngOnInit() {
    this.userID = this.auth.uid;
  }
  
  private openGallery (): void {
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
            this.data.upload("img_user/"+this.userID+".jpg", this.captureDataUrl).then((snapshot) => {
                this.user.imageUrl = snapshot.downloadURL;
                loading.dismiss();
            },
            err => this.showUploadAlert(err.message));
        }, 
        err => this.showUploadAlert(err.message));   
    }
    
    registerUser() {
        this.auth.registerUserIdentity(this.user).then(user => {
            this.navCtrl.push(HomePage);
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