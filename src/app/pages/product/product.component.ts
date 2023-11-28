import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  tallas = [
    'S',
    'M',
    'L',
    'XL'
  ];

  colores = [
    'Black',
    'White',
  ];

  opcionSeleccionada: string = '';

}
