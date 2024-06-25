import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminOrdersComponent } from 'src/app/pages/admin-orders/admin-orders.component';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  newStatus: string | undefined;
  newTracking: string | undefined;

  constructor(
    private dialogRef: MatDialogRef<AdminOrdersComponent>,
    private router: Router,
    private orderService: OrderService,
    //Pasamos los datos al diálogo
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.newStatus = this.data.order.status;
    this.newTracking = this.data.order.tracking;
  }

  removeItem(index: number) {
    this.data.order.items.splice(index, 1);
  }

  update() {
    if (this.newStatus) {
      this.data.order.status = this.newStatus;
    }
    if (this.newTracking) {
      this.data.order.tracking = this.newTracking;
    }

    this.orderService.update(this.data.order.orderNumber,this.data.order);
    this.dialogRef.close(); // Close the dialog

  }

  deleteOrder(orderId: string){
    this.orderService.delete(orderId);
  }

}
