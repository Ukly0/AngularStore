import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  
  id;
  product: Product = {} as Product;
  productSubscription: Subscription = new Subscription();
  constructor(
    private productoService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService) { 

    this.id = this.route.snapshot.paramMap.get("key");
    if (this.id)
      this.productSubscription = this.productoService
        .get(this.id)
        .subscribe((p) => (this.product = p));
    console.log(this.product);
    
  }

  addToCart(product: Product){
    this.cartService.addToCart(product);
  }


  ngOnInit(): void {
  }

  opcionSeleccionada: string = '';

}
