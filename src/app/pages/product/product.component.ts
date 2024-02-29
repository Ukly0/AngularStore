import { Component, OnInit } from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Variant } from "src/app/models/variant.model";
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
  variant: Variant = {} as Variant;
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
    this.variant.productKey = this.product.key ?? '';
    this.variant.selectedColor = this.selectedcolor;
    this.variant.selectedSize = this.selectedsize;
    
    this.cartService.addToCart(this.variant);
  }

  ngOnInit(): void {}

  
}
