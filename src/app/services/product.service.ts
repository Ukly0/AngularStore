import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Product } from '../models/product.model';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(  private db: AngularFireDatabase) { }


  create(product: any) {
    return this.db.list('/product').push(product);
  }

  getAllProducts() {
    return this.db.list('/product').snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }))
      )
    ) as unknown as Observable<Product[]>;
  }

  get(pId : any){
    return this.db.object('/product/' + pId).valueChanges() as Observable<Product>;
  }

  update(pId: any, product: any) {
    return this.db.object('/product/' + pId).update(product);
  }
}
