import { Component, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";
import { AuthService } from "src/app/services/auth.service";
import { ProductService } from "src/app/services/product.service";
import { UserService } from "src/app/services/user.service";
@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.css"],
})
export class WishlistComponent implements OnInit {
  products: Product[] = [];
  authkey: any;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    
    this.authkey = this.authService.userKey;
    console.log(this.authkey)
    this.getWishlist();
    console.log(this.authkey)
    console.log(this.products.length)
  }

  getWishlist(): void {
    this.userService.getWishlist(this.authkey).subscribe((data) => {
      this.products = [];
      for (let item of data) {
        let key = item.key; // This is the key of the item
        this.productService.get(key).subscribe((product) => {
          this.products.push(product);
        });
      }
    });
  }
}
