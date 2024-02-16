import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cart-item.model';
import { Cart } from 'src/app/models/cart.model';
import { from } from 'rxjs';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.css'
  ]
})
export class HeaderComponent implements OnInit {

  user: User | null = null;
  cartItems: CartItem[] = [];
  countproducto:number | undefined;

  constructor(
    private dialog: MatDialog,
    public auth: AuthService,
    private cartservice: CartService,
  ) {}


  async ngOnInit()  {
    this.auth.getUser().subscribe(user => this.user = user);
    let cart$ = await this.cartservice.getCart();
    cart$.subscribe((cart: { items: { [x: string]: any; }; }) => {
      for (let productId in cart.items) {
        console.log("Iterando");
        let item = cart.items[productId];
        this.countproducto += item.quantity;
      }
    });
  }

  LogOut() {
    this.auth.logout().then(() => {
      this.auth.userKey = null;
    });
  }

  LoginComponent (component: any) {
    throw new Error('Method not implemented.');
  }
  
  OpenLogin(){
    this.dialog.open(LoginComponent);
  }


  OpenCart(){
    console.log(this.cartItems);
  }
}
