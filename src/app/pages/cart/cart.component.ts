import { Component, OnInit } from "@angular/core";
import { OrderService } from "src/app/services/order.service";
import { AuthService } from "src/app/services/auth.service";
import { CartService } from "src/app/services/cart.service";
import { User } from "src/app/models/user.model";
import { CartItem } from "src/app/models/cartitem.model";
import { from, map, take } from "rxjs";
import { ProductService } from "src/app/services/product.service";
import { forkJoin } from "rxjs";
import { loadStripe } from "@stripe/stripe-js";
import { HttpClient } from "@angular/common/http";
import { Cart } from "src/app/models/cart.model";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  user: User | null = null;
  cartItems: CartItem[] = [];
  dataSource: CartItem[] = [];
  countproducto: number | undefined;
  totalPrice: number | undefined;

  displayedColumns: string[] = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];
  constructor(
    private auth: AuthService,
    private cartservice: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.auth.getUser().subscribe((user) => {
      this.user = user;
    });

    let cart$ = from(this.cartservice.getCart()); // Convert promise to observable
    cart$.subscribe((cart: { items: { [x: string]: any } }) => {
      this.countproducto = 0; // reset the count
      this.cartItems = []; // reset the cart items
      this.totalPrice = 0; // reset the total price

      let observables = [];
      for (let productId in cart.items) {
        let item = cart.items[productId];
        this.countproducto += item.quantity;

        // Get the product from the product service
        let observable = this.productService
          .get(item.product.productKey)
          .pipe(take(1))
          .pipe(
            map((product) => {
              // Create a new object with the desired structure
              let newItem: CartItem = {
                variant: {
                  productKey: item.product.productKey,
                  selectedColor: item.product.selectedColor,
                  selectedSize: item.product.selectedSize,
                  price: product.offerPrice ?? product.price,
                  title: product.title, // use the price from the product, or assign a default value of 0
                  img: product.images[0],
                },

                quantity: item.quantity,
              };

              // Calculate the total price for this variant
              if (!newItem.variant.price) newItem.variant.price = 0;
              let totalVariantPrice = newItem.variant.price * newItem.quantity;

              // Add the total price for this variant to the total price
              this.totalPrice = (this.totalPrice ?? 0) + totalVariantPrice;

              // Add the new object to the cart items
              this.cartItems.push(newItem);
            })
          );

        observables.push(observable);
      }

      forkJoin(observables).subscribe(() => {
        // Assign cartItems to dataSource after all products have been processed
        this.dataSource = this.cartItems;
      });
    });
  }

  clearCart() {
    
      this.cartservice.clearCart();
      this.cartItems = [];
      this.dataSource = this.cartItems;
    
  }

  clearItem(product: CartItem) {
    this.cartservice.clearItem(product.variant);
    this.cartItems = this.cartItems.filter(
      (item) => item.variant.productKey !== product.variant.productKey
    );
    this.dataSource = this.cartItems;
  }

  onCheckout() {
    this.http
      .post("https://ukiy0-7lwmd6wgrq-no.a.run.app/payment/checkout", {
        items: this.cartItems,
        email: this.user?.email,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          "pk_test_51OoRtGCktDADDsvxRjkOiye0Vb4pAFHdGaG5eGpeTlckRXFBg20jm0DA6U0qS70sgHrGlp7FNm3xmjuFibLke0um00cuj7QyIo"
        );
  
        stripe?.redirectToCheckout({ sessionId: res.id }).then(async (result) => {
          if (result.error) {
            // Si hay un error, manejarlo aquí
            console.log(result.error.message);
          } else {
            // Aquí puedes asumir que la operación de checkout fue exitosa
            console.log('Checkout successful');
  
            // Recuperar los detalles de la sesión de checkout
            const sessionRes = await fetch(`https://ukiy0-7lwmd6wgrq-no.a.run.app/payment/checkout-session?sessionId=${res.id}`);
            const session = await sessionRes.json();
            let cart: Cart = {cartItems : this.cartItems};
            let order = {cart: cart, status: 'pending', datePlaced: new Date().getTime(), shipping: 'On hold' };
            // El correo electrónico del cliente está en session.customer_email
            console.log('Customer email:', session.customer_email);
            this.cartItems = [];
          }
        });
      });
  }
}
