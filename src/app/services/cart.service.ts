import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';	
import { Product } from '../models/product.model';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private db: AngularFireDatabase) { }

  create(){
    return this.db.list('/shopping-cart').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId:string, productId:string){
    return this.db.object('/shopping-cart/'+cartId+'/items/'+productId);
  }


  private async getCart(){
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/'+cartId);
  }

  private async getOrCreateCartId(){
    let cartId = localStorage.getItem('cartId');
    if(cartId) return cartId;

    let result = await this.create()
    localStorage.setItem('cartId', result.key as string);
    return result.key;
  }

  async addToCart(product: Product){
    this.updateItemQuan(product, +1)
  }


  async removeToCart(product: Product){
    this.updateItemQuan(product, -1)
  }


  private async updateItemQuan(product: Product, number: number){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId as string, product.key as string);
    item$.valueChanges().pipe(take(1)).subscribe(item => {
      if (item) {
        item$.update({product:product, quantity: (item as any).quantity + number});
      } 
    });
  }
}
