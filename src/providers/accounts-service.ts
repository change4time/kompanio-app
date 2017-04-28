import { Injectable } from '@angular/core';
import { DataService } from './data-service';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AccountsService {
  public accounts: any = [];
  
  constructor(private data: DataService) {
    
  }

  get(delegation) {
    return this.data.account(delegation.$key).subscribe(account => delegation.account = account);
  }
}
