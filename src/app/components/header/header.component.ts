import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { CartService } from 'src/app/services/cart.service';
import {  Variant } from 'src/app/models/variant.model';
import { CartItem } from 'src/app/models/cartitem.model';
import { from } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { validateHorizontalPosition } from '@angular/cdk/overlay';


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
  totalPrice:number | undefined;
  constructor(
    private dialog: MatDialog,
    public auth: AuthService,
    private cartservice: CartService,
    private productService: ProductService
  ) {}


  async ngOnInit() {
    this.auth.getUser().subscribe(user => {
      this.user = user;
    });
  
    let cart$ = from(this.cartservice.getCart()); // Convert promise to observable
    cart$.subscribe((cart: { items: { [x: string]: any; }; }) => {
      this.countproducto = 0; // reset the count
      this.cartItems = []; // reset the cart items
      this.totalPrice = 0; // reset the total price
  
      for (let productId in cart.items) {
        let item = cart.items[productId];
        this.countproducto += item.quantity;
  
        // Get the product from the product service
        this.productService.get(item.product.productKey).pipe(take(1)).subscribe(product => {
          // Create a new object with the desired structure
          let newItem: CartItem = {
            variant: {
              productKey: item.product.productKey,
              selectedColor: item.product.selectedColor,
              selectedSize: item.product.selectedSize,
              price: product.offerPrice ?? product.price ,
              title: product.title// use the price from the product, or assign a default value of 0
            },

            quantity: item.quantity
          };
  
          // Calculate the total price for this variant
          if (!newItem.variant.price) newItem.variant.price = 0;
          let totalVariantPrice = newItem.variant.price * newItem.quantity;
      
          // Add the total price for this variant to the total price
          this.totalPrice = (this.totalPrice ?? 0) + totalVariantPrice;
        
          // Add the new object to the cart items
          this.cartItems.push(newItem);
        });
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
