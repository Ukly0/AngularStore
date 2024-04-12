import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
})
export class SuccessComponent implements OnInit {

constructor(private route: ActivatedRoute, private cartService: CartService) { }

 
ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const sessionId = params['session_id'];

    if (sessionId) {
      this.cartService.clearCart();
    }
  });
}

}
