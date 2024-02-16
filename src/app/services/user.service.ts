import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import firebase from 'firebase/compat';
import { Observable, map, take } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private db: AngularFireDatabase) { }

  save(user: firebase.User) {  
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    });
  }
  //AngularFireObject<User> es un observable que contiene un objeto de tipo User
  get(uid: string): AngularFireObject<User> {
    return this.db.object('/users/' + uid);
  }

  addwishlist(uid: string, pid: string) {
    this.db.object('/users/' + uid + '/wishlist/' + pid).set(true);
  }

  isWishlisted(uid: string, pid: string): Observable<boolean> {
    return this.db.object('/users/' + uid + '/wishlist/' + pid).valueChanges().pipe(
      map((data) => {
        return data ? true : false;
      })
    );
  }

  getWishlist(uid: string): Observable<any> {
    return this.db.list('/users/' + uid + '/wishlist').valueChanges();
  }

  removeWishlist(uid: string, pid: string) {
    this.db.object('/users/' + uid + '/wishlist/' + pid).remove();
  }

  updateUserCartId(uid: string, cartId: string) {
    console.log('Updating user cart id');
    return this.db.object('/users/' + uid).update({ cartId: cartId });
  }

  getUserCartId(uid: string) {
    return this.db.object('/users/' + uid + '/cartId').valueChanges();
  }
}
