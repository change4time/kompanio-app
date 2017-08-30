import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the PhotoURL pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'photoURL'
})
@Injectable()
export class PhotoURL {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value, args) {
    if(value && value.photoURL)
      return value.photoURL;
    else if(value && value.id)
      return "https://firebasestorage.googleapis.com/v0/b/kompanio-network.appspot.com/o/"+encodeURIComponent("photos/thumb_" + value.id + ".jpg")+"?alt=media";
    else if(value)
      return "https://firebasestorage.googleapis.com/v0/b/kompanio-network.appspot.com/o/"+encodeURIComponent("photos/thumb_" + value + ".jpg")+"?alt=media";
    else
      return "http://www.freeiconspng.com/uploads/profile-icon-9.png";
  }
}
