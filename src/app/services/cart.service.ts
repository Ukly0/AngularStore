import { Injectable, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Product } from "../models/product.model";
import { first, map, switchMap, take, tap } from "rxjs/operators";
import { Cart } from "../models/cart.model";
import { Observable, from, of } from "rxjs";
import { CartItem } from "../models/cart-item.model";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { user } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class CartService implements OnInit {
  userid: string | null = null;
  cartId: string | null = null;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService,
    private userservice: UserService
  ) {
   
  }
  ngOnInit(): void {
    localStorage.clear();
    this.userservice.getUserCartId(this.auth.userKey as string).subscribe((cartId: unknown) => {
      this.cartId = cartId as string;
    });
  }

  create() {
    console.log("create");
    return this.db.list("/shopping-cart").push({
      dateCreated: new Date().getTime(),
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object("/shopping-cart/" + cartId + "/items/" + productId);
  }

  async getCart(): Promise<any> {
    let cartId: string = await this.getOrCreateCartId().toPromise();
    console.log("CartId: ", cartId);
    return this.db
      .object("/shopping-cart/" + cartId)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  getOrCreateCartId(): Observable<any> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (user) {
          // El usuario está registrado
          return this.userservice.getUserCartId(user.uid).pipe(
            switchMap(userCartId => {
              if (userCartId) {
                console.log('User cart ID:', userCartId);
                // El usuario tiene un carrito, devolvemos el id del carrito
                return of(userCartId);
              } else {
                // El usuario no tiene un carrito, creamos uno y devolvemos el id
                return from(this.create()).pipe(
                  tap(result => {
                    this.userservice.updateUserCartId(user.uid, result.key as string);
                    console.log('Created new cart ID for user:', result.key);
                  }),
                  map(result => result.key as string)
                );
              }
            })
          );
        } else {
          // El usuario no está registrado
          let cartId = localStorage.getItem('cartId');
          console.log('Local storage cart ID:', cartId);
          if (cartId) {
            // El usuario tiene un carrito en localStorage, devolvemos el id del carrito
            return of(cartId);
          } else {
            // El usuario no tiene un carrito en localStorage, creamos uno y devolvemos el id
            return from(this.create()).pipe(
              tap(result => {
                localStorage.setItem('cartId', result.key as string);
                console.log('Created new cart ID in local storage:', result.key);
              }),
              map(result => result.key as string)
            );
          }
        }
      })
    );
  }

  async addToCart(item: CartItem) {
    this.updateItemQuantity(item, +1);
  }

  async removeToCart(item: CartItem) {
    this.updateItemQuantity(item, -1);
  }

  private async updateItemQuantity(product: CartItem, number: number) {
    let cartId = await this.getOrCreateCartId();
    let variant = product.selectedColor + product.selectedSize; // Asume que color y size son propiedades de CartItem
    let item$ = this.getItem(cartId as any, product.productKey as string + variant);
    item$
      .valueChanges()
      .pipe(take(1))
      .subscribe((item) => {
        if (item) {
          item$.update({
            product: product,
            quantity: (item as any).quantity + number,
          });
        } else {
          item$.set({ product: product, quantity: 1 });
        }
      });
  }
}
