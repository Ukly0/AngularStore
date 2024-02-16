import { Component, OnInit } from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CartItem } from "src/app/models/cart-item.model";
import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
})

export class ProductComponent implements OnInit {
  id;
  selectedcolor: string = "";
  selectedsize: string = "";
  product: Product = {} as Product;
  cartitem: CartItem = {} as CartItem;
  productSubscription: Subscription = new Subscription();
  constructor(
    private productoService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {
    this.id = this.route.snapshot.paramMap.get("key");
    this.productSubscription = this.productoService
      .get(this.id)
      .subscribe((p) => {
        this.product = p;
        this.selectedcolor = this.product.colors[0];
        this.selectedsize = this.product.sizes[0];
      });;
  }

  addToCart() {
    this.cartitem.productKey = this.product.key ?? '';
    this.cartitem.selectedColor = this.selectedcolor;
    this.cartitem.selectedSize = this.selectedsize;
  
    this.cartService.addToCart(this.cartitem);
  }

  ngOnInit(): void {}

  
}
