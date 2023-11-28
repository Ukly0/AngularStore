export class Product {
    id: number;
    img: string;
    nombre: string;
    precio: number;
    descripcion: string;
  
    constructor(id: number, img: string, nombre: string, precio: number, descripcion: string) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.descripcion = descripcion;
      this.img = img
    }
  }