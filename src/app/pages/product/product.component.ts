import { Component, OnInit } from "@angular/core";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Variant } from "src/app/models/variant.model";
import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { ProductService } from "src/app/services/product.service";
import * as moment from "moment-timezone";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit {
  id;
  selectedcolor: string = "";
  selectedsize: string = "";

  countdown: any = {
    days: 0,
    minutes: 0,
    seconds: 0,
  };

  product: Product = {} as Product;
  variant: Variant = {} as Variant;
  productSubscription: Subscription = new Subscription();
  constructor(
    private productoService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {
    this.id = this.route.snapshot.paramMap.get("key");
    this.productSubscription = this.productoService
      .get(this.id)
      .subscribe((p) => {
        this.product = p;
        this.selectedcolor = this.product.colors[0];
        this.selectedsize = this.product.sizes[0];
      });
  }

  addToCart() {
    this.variant.productKey = this.product.key ?? "";
    this.variant.selectedColor = this.selectedcolor;
    this.variant.selectedSize = this.selectedsize;

    this.cartService.addToCart(this.variant);
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown() {
    setInterval(() => {
      const now = moment().tz("America/New_York");
      const nextMonday = now.clone().day(8).hour(0).minute(1).second(0);
      const duration = moment.duration(nextMonday.diff(now));
      this.countdown = {
        days: Math.floor(duration.asDays()),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      };
    }, 1000);
  }
}
