import { CartComponent } from './cart.component';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { of, from } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service'; // Add this line

describe('CartComponent', () => {
  let component: CartComponent;
  let productService: ProductService;
  let orderService: OrderService;
  let http: HttpClient;
  let cartService: CartService;
  let auth: AuthService; // Add this line

  beforeEach(() => {
    productService = jasmine.createSpyObj('ProductService', ['get']);
    orderService = jasmine.createSpyObj('OrderService', ['']);
    http = jasmine.createSpyObj('HttpClient', ['']);
    cartService = jasmine.createSpyObj('CartService', ['getCart']);
    auth = jasmine.createSpyObj('AuthService', ['getUser']); // Add this line

    (auth.getUser as jasmine.Spy).and.returnValue(of({ uid: '123' })); // Add this line

    component = new CartComponent(auth, cartService, productService, orderService, http); // Modify this line
  });

  it('inicializar correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('calcular el precio correctamente', async () => {
    const cartItems = {
      '1': {
        product: {
          productKey: '1',
          selectedColor: 'red',
          selectedSize: 'M'
        },
        quantity: 2
      }
    };
    
    const product = {
      '1': {
        offerPrice: 100,
        price: 200,
        images: ['image1.jpg'] 
      }
    };
    
    (cartService.getCart as jasmine.Spy).and.returnValue(Promise.resolve({ items: cartItems }));
    (productService.get as jasmine.Spy).and.returnValue(of(product['1']));    
    await component.ngOnInit();
    
    expect(component.totalPrice).toBe(200);
  });

  

  
});