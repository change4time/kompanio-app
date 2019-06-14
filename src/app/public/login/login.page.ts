import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  error: string = "";
  credentials:any = { email: null, password: null };
  signInForm:boolean = false;
  returnUrl = "/";

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  signIn(): void {
    this.signInForm = true;
  }
  
  signUp(): void {
    this.router.navigate(['register']);
  }
  
  signInWithEmail(): void {
    this.error = "Connecting...";
    this.auth.signInWithEmail(this.credentials).then(authData => {
        this.router.navigateByUrl(this.returnUrl);
    }).catch(e => {
        this.error = e.message;
    });
  }
}
