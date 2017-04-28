import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import moment from 'moment';

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
        return this.af.database.object(path).update(data);
    }
    
    set(path: string, data: any) {
        return this.af.database.object(path).set(data);
    }

    list(path: string, query: any = null): FirebaseListObservable<any> {
        if(query)
          return this.af.database.list(path, query);
        else
          return this.af.database.list(path);
    }

    object(path: string): FirebaseObjectObservable<any> {
        return this.af.database.object(path);
    }
    
    user(id: string): Observable<UserModel> {
        return this.af.database.object('users/'+id).map(res => <UserModel>UserModel.fromObject(res) );
    }
    
    auth(id: string): Observable<UserModel> {
        return this.af.database.object('auths/'+id).map(res => <UserModel>UserModel.fromObject(res) );
    }
    
    account(id: string): Observable<AccountModel> {
        return this.af.database.object('accounts/'+id+'/state').map(res => <AccountModel>AccountModel.fromObject(id, res) );
    }

    remove(path: string) {
      return this.af.database.object(path).remove();
    }
    
    searchIdentities(search: string, groups: boolean): Promise<any> {
      let g = groups ? '&groups=1' : '';
      return this.http.get('https://us-central1-bank4time.cloudfunctions.net/identities?q='+search+g).map(function(res) { 
        var list = [];
        for(var id of res.json())
          list.push(Identity.fromObject(id));
        return list;
      }).toPromise();
    }
    
    get(path: string): Promise<any> {
        return this.http.get('https://us-central1-bank4time.cloudfunctions.net/'+path).map(res => res.json()).toPromise();
    }
    
    post(path: string, data: any): Promise<any> {
      //var headers = new Headers();
      //headers.append('Content-Type', 'application/json');//, { headers: headers }
      return this.http.post('https://us-central1-bank4time.cloudfunctions.net/'+path, data).map(res => res.json()).toPromise();
    }
    
    imageUrl(id) {
      return 
    }
}

export class Identity {
  private id: string = null;
  name: string = null;
  account: AccountModel = null;
  
  static fromObject(json): Identity {
    var obj = new Identity(json.$key);
    obj.name = json.name;
    return obj;
  }
  
  constructor(id) {
    this.id = id;
  }
  
  get $key() {
    return this.id;
  }
}

export class Payment {
  id: string;
  amount: number;
  created: number = Date.now();
  from: any = {
    id: null,
    name: null,
    label: null
  };
  to: any = {
    id: null,
    name: null,
    label: null
  };
  by: any = {
    id: null,
    name: null
  };
  authorization: any = null;
  
  constructor(auth, fromAccount, toAccount, amount) {
    if(fromAccount) {
      this.from.id = fromAccount.id;
      this.from.name = fromAccount.name;
    }
    
    if(auth) {
      this.by.id = auth.uid;
      this.by.name = auth.name;
    }
    
    this.to.id = toAccount.id;
    this.to.name = toAccount.name;
    
    this.amount = amount * 3600 * 1000;
  }
}

export class AccountModel {
  
  $key: string;
  id: string;
  created: number;
  current: any;
  details: any;
  ongoing: any;
  type: string;

  static fromObject(id, json): AccountModel {
    var obj = new AccountModel();
    obj.$key = id;
    obj.id = id;
    obj.created = json.created;
    obj.current = json.current;
    obj.ongoing = json.ongoing;
    obj.type = json.type;
    return obj;
  }

  get ongoingBalance() {
    let since = moment().diff(moment(this.ongoing.updated));
    let ongoing = since * this.ongoing.balance;
    return Math.floor(ongoing);
  }
  
  get realTimeBalance() {
    return this.current.balance + this.ongoingBalance;
  }
}

export class DelegationModel extends Identity {
  delegate: string = null;
  read: boolean = false;
  pay: boolean = false;
  manage: boolean = false;
  collect: boolean = false;
  
  static fromObject(json): DelegationModel {
    var obj = new DelegationModel(json.$key, json.name, null);
    obj.read = json.read;
    obj.pay = json.pay;
    obj.manage = json.manage;
    obj.collect = json.collect;
    return obj;
  }
  
  constructor(id, name, delegate) {
    super(id);
    this.name = name;
    this.delegate = delegate;
  }
}

export class UserModel extends Identity {
  identity: any = {
    firstName: '',
    lastName: '',
    birthDate: ''
  };
  contact: any = {
    phone: '',
    email: ''
  };
  infos: any = {
    like: ' ',
    know: ' ',
    can: ' '
  };
  delegations: DelegationModel[] = [];
  photoURL: string = null;
  
  static fromObject(json): UserModel {
    var obj = new UserModel(json.$key);
    if(json.identity)
      obj.name = json.identity.firstName + ' ' + json.identity.lastName;
    obj.identity = json.identity;
    obj.contact = json.contact;
    obj.infos = json.infos;
    for(var key in json.delegations) {
      json.delegations[key].$key = key;
      obj.delegations.push(DelegationModel.fromObject(json.delegations[key]));
    }
    return obj;
  }
  
  constructor(id) {
    super(id);
  }
}