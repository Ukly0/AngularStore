import { Component, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<OrderComponent>,
    private router: Router,
    //Pasamos los datos al diálogo
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending':
        return 'var(--colorAcento)';
      case 'On Hold':
        return 'var(--colorAcento3)';
      case 'Complete':
        return 'var(--colorAcento2)';
      default:
        return 'transparent';
    }
  }

}
