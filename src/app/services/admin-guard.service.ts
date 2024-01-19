import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { map, switchMap } from 'rxjs/operators';
import { LoginComponent } from '../components/login/login.component';
import { UserService } from './user.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor( private auth: AuthService, private dialog: MatDialog, private userServ: UserService) { }

  canActivate(): Observable<boolean>{
    return this.auth.user$.pipe(switchMap(user => {
      if (user) {
        return this.userServ.get(user.uid).valueChanges();
      }
      return of(null);
    })).pipe(map(appUser => appUser && appUser.isAdmin || false));
  }

}