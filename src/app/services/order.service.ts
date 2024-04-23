import { Injectable, OnInit } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { first, map, switchMap, take, tap } from "rxjs/operators";
import { Observable, from, of } from "rxjs";
import { Variant } from "../models/variant.model";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { Order } from "@stripe/stripe-js";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFireDatabase, 
    private http: HttpClient
  ) { }

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
        const oldOrder = { ...snapshot };
        this.db.object('/orders/' + snapshot.key).update(order);
        const changes = this.getChanges(oldOrder, order);
        this.sendEmail(order, changes);
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
 

  getChanges(oldOrder: any, newOrder: any) {
    let changes: {[key: string]: {old: any, new: any}} = {}; 
    for (let key in oldOrder) {
      if (oldOrder[key] !== newOrder[key]) {
        changes[key] = {
          old: oldOrder[key],
          new: newOrder[key]
        };
      }
    }
    return changes;
  }

  sendEmail(order: any, changes: any) {
    this.http
      .post("http://localhost:4242/email/update", {
        order: order,
        changes: changes,
        email: order.email
      })
      .subscribe((res) => {
        console.log(res);
      });

      console.log('Email sent Update Client');
  }

}
