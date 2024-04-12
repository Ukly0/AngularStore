import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Product } from "../models/product.model";
import { Observable, map, take } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/storage";
import "firebase/storage"; // Import the necessary package for Firebase storage
@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  create(product: any) {
    return this.db.list("/product").push(product);
  }

  getAllProducts() {
    return this.db
      .list("/product")
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => {
            let product = { key: c.payload.key, ...(c.payload.val() as {}) };
            if ((product as any).images) {
              (product as any).images.sort();
            }
            return product;
          })
        )
      ) as unknown as Observable<Product[]>;
  }

  get(pId: any) {
    return this.db
      .object("/product/" + pId)
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          let product = snapshot.payload.val() as any;
          if (product.images) {
            product.images.sort();
          }
          return { key: snapshot.key, ...product };
        })
      ) as Observable<Product>;
  }

  update(pId: any, product: any) {
    console.log("Actualizando producto");
    return this.db.object("/product/" + pId).update(product);
  }

  delete(pId: any) {
    this.get(pId)
      .pipe(take(1))
      .subscribe((product) => {
        // Si el producto tiene imágenes, eliminarlas
        // ...
        if (product.images) {
          for (const imageUrl of product.images) {
            let imageRef = this.storage.refFromURL(imageUrl);
            imageRef
              .delete()
              .toPromise()
              .then(() => {
                // Convert Observable to Promise
                console.log("Image deleted successfully");
              })
              .catch((error: any) => {
                console.log("Error while deleting the image", error);
              });
          }
        }
        this.db.object("/product/" + pId).remove();
        // ...
      });
  }

getOffer() {
  return this.db
    .list("/product")
    .snapshotChanges()
    .pipe(
      map((products) =>
        products
          .map((product) => ({ key: product.key, ...product.payload.val() as Product }))
          .filter((product) => product.offerPrice != null)
      )
    );
}
}
