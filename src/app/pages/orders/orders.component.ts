import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderComponent } from 'src/app/components/order/order.component';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  user: User | null = null;
  orders: any;

  constructor( private auth: AuthService,
    private orderService: OrderService,
    private dialog: MatDialog, ) { }

  

  async ngOnInit() {
   
      this.getOrders();
  }

  getOrders(){
    console.log (this.auth.userEmail);
    this.orders = this.orderService.getOrderByEmail(this.auth.userEmail as string);
    
    this.orders.subscribe((data: any) => {
      console.log(data);
    });
  }

  openOrder(order: any){
    this.dialog.open(OrderComponent, {
      data: {
        order: order
      }
    });
  }

 

  


}
