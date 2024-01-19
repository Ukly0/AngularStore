import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import firebase from 'firebase/compat';
import { Observable } from 'rxjs';
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

  
}
