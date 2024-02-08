import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-list-product',
  templateUrl: './admin-list-product.component.html',
  styleUrls: ['./admin-list-product.component.css']
  
})
export class AdminListProductComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  productsSubscription: Subscription;
  filter: any [] = [];

  constructor(private productService: ProductService) {
   this.productsSubscription = this.productService.getAllProducts().subscribe((products: Product[]) => {
      this.filter = this.products = products;
    });

  }

  filtertable(query: string){  
    console.log(query);
    this.filter = (query) ?
    this.products.filter((p: { title: string; }) => p.title.toLowerCase().includes(query.toLowerCase())) : this.products;
    console.log(this.filter);
  }

  deleteProduct(id: any){
    this.productService.delete(id);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }
}
