import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { LoginComponent } from '../components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private auth: AuthService, private dialog: MatDialog, private route: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.auth.user$.pipe(
        map(user => {
          if (user) {
            return true;
          } else {
            this.dialog.open(LoginComponent, {
              //Guardamos la url para redirigir al usuario a ella una vez que inicie sesión
              data: { returnUrl: state.url } 
            });
            return false;
          }
        })
      );
  }
}