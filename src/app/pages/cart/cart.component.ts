import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
    
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [{
    product: "https://placehold.co/100",
    name: "Ukiyo Shirt",
    price: 29.99,
    quantity: 1,
    id: 1
  },
  {
    product: "https://placehold.co/100",
    name: "Ukiyo Shirt",
    price: 29.99,
    quantity: 2,
    id: 1,
  }
] };

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
    this.dataSource = this.cart.items;
  }

  getTotal(items: Array<CartItem>): number {
    return items.map((item)=> item.price *item.quantity)
    .reduce((prev,current) => prev + current, 0)
  }

}
