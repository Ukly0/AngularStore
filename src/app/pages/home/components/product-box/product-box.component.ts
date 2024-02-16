import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subscription, of, switchMap, take } from "rxjs";
import { LoginComponent } from "src/app/components/login/login.component";
import { Product } from "src/app/models/product.model";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-product-box",
  templateUrl: "./product-box.component.html",
  styleUrls: ["./product-box.component.css"],
})
export class ProductBoxComponent implements OnInit {
  @Input() fullWidthMode = false;
  @Input() product!: Product;


  iswishlisted$: Observable<Boolean | null>;

  constructor(
    private userservice: UserService,
    private authservice: AuthService,
    private dialog: MatDialog
  ) {
    this.iswishlisted$ = this.authservice.user$.pipe(
      switchMap((user) => {
        if (user) {
          return this.userservice.isWishlisted(
            user.uid,
            this.product.key as string
          );
        }
        return of(false);
      })
    );
  }

  ngOnInit(): void {}

  toggleWishlist() {
    if (!this.authservice.userKey) {
      this.dialog.open(LoginComponent);
      return;
    } else {
      
        this.iswishlisted$.pipe(take(1)).subscribe((isWishlisted) => {
          if (isWishlisted) {
            this.removeFromWishlist();
          } else {
            this.addToWishlist();
          }
        })
      
    }
  }

  updateWishlist(add: boolean) {
    console.log("updateWishlist");
    const userUid = this.authservice.userKey;
    console.log("UserUid: ", userUid);
    if (this.product.key && userUid) {
      if (add) {
        console.log("Añadiendo a la lista de deseos");
        this.userservice.addwishlist(userUid, this.product.key);
      } else {
        this.userservice.removeWishlist(userUid, this.product.key);
      }
      
    }
  }

  addToWishlist() {
    console.log("Añadiendo a la lista de deseos add: true");
    this.updateWishlist(true);
  }


  removeFromWishlist() {
    this.updateWishlist(false);
  }



  iswishlisted() {
    return this.userservice.isWishlisted(
      this.authservice.getCurrentUserUid() ?? "",
      this.product.key as string
    );
  }
}
