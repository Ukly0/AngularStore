import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart.model';
import { CartItem } from 'src/app/models/cart-item.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
    
})
export class CartComponent implements OnInit {


  dataSource: Array<CartItem> = []
  displayedColumns : Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ]
  constructor() { }

  ngOnInit(): void {
  }

 

}
