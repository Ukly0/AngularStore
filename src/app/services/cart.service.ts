import { Injectable, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { first, map, switchMap, take, tap } from "rxjs/operators";
import { Observable, from, of } from "rxjs";
import { Variant } from "../models/variant.model";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";

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
  ) {}
  ngOnInit(): void {
    localStorage.clear();
    this.userservice
      .getUserCartId(this.auth.userKey as string)
      .subscribe((cartId: unknown) => {
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

  getCart(): Observable<any> {
    return this.getOrCreateCartId().pipe(
      switchMap((cartId) => {
        console.log("getCart", cartId);
        return this.db.object("/shopping-cart/" + cartId).valueChanges();
      })
    );
  }

  clearCart() { 

    
    console.log("clearCart");
    this.getOrCreateCartId().pipe(first()).subscribe((cartId) => {
      this.db.object("/shopping-cart/" + cartId).remove();
    });
    localStorage.removeItem('cartId');
   
  }


  clearItem(product: Variant) {
    console.log("clearItem");
    this.getOrCreateCartId().pipe(first()).subscribe((cartId) => {
      let variant = product.selectedColor + product.selectedSize;
      let item$ = this.db.object("/shopping-cart/" + cartId + "/items/" + product.productKey + variant);
      item$.snapshotChanges().pipe(take(1)).subscribe(item => {
        if (item.payload.exists()) {
          let quantity = (item.payload.val() as any).quantity || 0;
          if (quantity > 1) {
            item$.update({ quantity: quantity - 1 });
          } else {
            item$.remove();
          }
        }
      });
    });
  }

  getOrCreateCartId(): Observable<any> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (user) {
          // El usuario está registrado
          return this.userservice.getUserCartId(user.uid).pipe(
            switchMap((userCartId) => {
              if (userCartId) {
                console.log("User cart ID:", userCartId);
                // El usuario tiene un carrito, devolvemos el id del carrito
                return of(userCartId);
              } else {
                // El usuario no tiene un carrito, creamos uno y devolvemos el id
                return from(this.create()).pipe(
                  tap((result) => {
                    this.userservice.updateUserCartId(
                      user.uid,
                      result.key as string
                    );
                    console.log("Created new cart ID for user:", result.key);
                  }),
                  map((result) => result.key as string)
                );
              }
            })
          );
        } else {
          // El usuario no está registrado
          let cartId = localStorage.getItem("cartId");
          console.log("Local storage cart ID:", cartId);
          if (cartId) {
            // El usuario tiene un carrito en localStorage, devolvemos el id del carrito
            return of(cartId);
          } else {
            // El usuario no tiene un carrito en localStorage, creamos uno y devolvemos el id
            return from(this.create()).pipe(
              tap((result) => {
                localStorage.setItem("cartId", result.key as string);
                console.log(
                  "Created new cart ID in local storage:",
                  result.key
                );
              }),
              map((result) => result.key as string)
            );
          }
        }
      })
    );
  }

  async addToCart(item: Variant) {
    this.updateItemQuantity(item, +1);
  }

  async removeToCart(item: Variant) {
    this.updateItemQuantity(item, -1);
  }

  private async updateItemQuantity(product: Variant, number: number) {
    //Obtenemos el primer objeto del carrtio
    let cartId = await this.getOrCreateCartId().pipe(first()).toPromise();
    console.log("updateItemQuantity", cartId);
    let variant = product.selectedColor + product.selectedSize; // Asume que color y size son propiedades de CartItem
    let item$ = this.getItem(
      cartId as any,
      (product.productKey as string) + variant
    );
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
