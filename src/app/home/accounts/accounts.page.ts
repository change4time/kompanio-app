import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {

  currentBalance: any = 0;
  authorizations: any;
  totalName: string = 'TODAY';
  totalBalance: number = 0;

  constructor(private auth: AuthService) {
    
  }

  ngOnInit() {
  }
}
