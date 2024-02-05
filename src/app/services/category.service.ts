import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFireDatabase) { }


  getCategories(){
    return this.db.list('/category', ref => ref.orderByChild('name'));
  }

  getThemes(){
    return this.db.list('/theme', ref => ref.orderByChild('name'));
  }

  getColor(){
    return this.db.list('/color', ref => ref.orderByChild('name'));
  }

  getSize(){
    return this.db.list('/size', ref => ref);
  }

}
