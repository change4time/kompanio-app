import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

/*
  Generated class for the DataService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataService {

  constructor(public http: Http, private af: AngularFire) {
  }
  
    upload(path: string, data: any) {
        return firebase.storage().ref().child(path).putString(data, firebase.storage.StringFormat.DATA_URL);
    }
  
    push(path: string, data: any): Observable<any> {
    return Observable.create(observer => {
      this.af.database.list(path).push(data).then(firebaseNewData => {
        // Return the uid created
        let newData: any = firebaseNewData;
        observer.next(newData.path.o[newData.path.o.length - 1]);
      }, error => {
        observer.error(error);
      });
    });
    }

    update(path: string, data: any) {
        this.af.database.object(path).update(data);
    }

    list(path: string): FirebaseListObservable<any> {
        return this.af.database.list(path);
    }

    object(path: string): FirebaseObjectObservable<any> {
        return this.af.database.object(path);
    }

    remove(path: string): Observable<any> {
        return Observable.create(observer => {
          this.af.database.object(path).remove().then(data => {
            observer.next();
          }, error => {
            observer.error(error);
          });
        });
    }
}
