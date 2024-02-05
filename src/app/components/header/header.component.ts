import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.css'
  ]
})
export class HeaderComponent implements OnInit {

  user: User | null = null;

  constructor(
    private dialog: MatDialog,
    public auth: AuthService,
  ) {
    auth.getUser().subscribe(user => this.user = user);
  }

  
  ngOnInit(): void {

  }

  LogOut(){
    this.auth.signOut();
  }

  LoginComponent (component: any) {
    throw new Error('Method not implemented.');
  }
  
  OpenLogin(){
    this.dialog.open(LoginComponent);
  }
}
