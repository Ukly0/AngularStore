import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderFormComponent } from 'src/app/components/order-form/order-form.component';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
 
  orders: any;

  constructor( 
    private orderService: OrderService,
    private dialog: MatDialog, ) { }

  

  async ngOnInit() {
   
      this.getOrders();
  }

  getOrders(){
    
    this.orders = this.orderService.getOrders();
    
    this.orders.subscribe((data: any) => {
      console.log(data);
    });
  }

  openOrder(order: any){
    this.dialog.open(OrderFormComponent, {
      data: {
        order: order
      }
    });
  }

  
}
