import { Injectable, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { first, map, switchMap, take, tap } from "rxjs/operators";
import { Observable, from, of } from "rxjs";
import { Variant } from "../models/variant.model";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { Order } from "@stripe/stripe-js";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFireDatabase) { }

  create(order: Order) {
    return this.db.list('/orders').push(order);
  }

  getOrders() {
    return this.db.list('/orders').valueChanges();
  }

  getOrderByEmail(email: string) {
    return this.db.list('/orders', ref => ref.orderByChild('email').equalTo(email)).valueChanges();
  }

  updateshipping(orderId: string, shipping: any) {
    return this.db.object('/orders/' + orderId).update({ shipping: shipping });
  }

  update(orderNumber: number, order: any) {
    let ref = this.db.list('/orders', ref => ref.orderByChild('orderNumber').equalTo(orderNumber));
    ref.snapshotChanges().pipe(
      take(1),
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...(c.payload.val() as object) }))
      )
    ).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.db.object('/orders/' + snapshot.key).update(order);
      });
    });
  }

  delete(orderNumber: string) {
    let ref = this.db.list('/orders', ref => ref.orderByChild('orderNumber').equalTo(orderNumber));
    ref.snapshotChanges().pipe(
      take(1),
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...(c.payload.val() as object) }))
      )
    ).subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.db.object('/orders/' + snapshot.key).remove();
      });
    });
  }
 
}
