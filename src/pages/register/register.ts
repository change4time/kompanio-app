import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { DataService, UserModel } from '../../providers/data-service';

import { Camera } from 'ionic-native';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  loader;
  alertCtrl: AlertController;
  error: string = null;
  captureDataUrl: string;
  registrationPending: boolean = false;
  user: UserModel = new UserModel(null);
  password: string;
  password2: string;

  constructor(public navCtrl: NavController, private auth: AuthService, private data: DataService, alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.alertCtrl = alertCtrl;
    if(this.auth.user) {
      this.user = this.auth.user;
      this.registrationPending = true;
    } else {
      this.user.photoURL = "https://www.iconexperience.com/_img/i_collection_png/512x512/plain/id_card.png";
    }
  }
  
  uploadPhoto(photo) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.data.upload("prospects/" + this.user.contact.email + ".jpg", photo).then((snapshot) => {
      this.user.photoURL = snapshot.downloadURL;
      loading.dismiss();
    }, err => this.showUploadAlert(err.message));
  }

  fileChangeEvent(fileInput: any){
    this.uploadPhoto(fileInput.target.files[0]);
  }

  openGallery (): void {
    if(this.registrationPending)
      return;
      
    let cameraOptions = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: Camera.EncodingType.JPEG,      
      correctOrientation: true,
      targetWidth: 500,
      targetHeight: 500
    }

    Camera.getPicture(cameraOptions).then(imageData => {
      this.captureDataUrl = 'data:image/png;base64,' + imageData;
      this.uploadPhoto(this.captureDataUrl);
    }, err => this.showUploadAlert(err.message));   
  }

  registerUser() {
    if(this.registrationPending)
      return;
    
    this.auth.registerUser(this.user.contact.email, this.password, this.user).then((profile) => {
        this.registrationPending = true;
    }, (error) => { this.error = error.message; console.log(error); });
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
