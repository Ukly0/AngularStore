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
    return this.db.list('/orders').valueChanges() as Observable<Order[]>;
  }

  getOrderByEmail(email: string) {
    return this.db.list('/orders', ref => ref.orderByChild('email').equalTo(email));
  }

  updateshipping(orderId: string, shipping: any) {
    return this.db.object('/orders/' + orderId).update({ shipping: shipping });
  }

 
}
