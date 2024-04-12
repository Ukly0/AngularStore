import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { GuardService } from './services/guard.service';
import { AdminGuardService } from './services/admin-guard.service';
import { Product } from './models/product.model';
import { AdminListProductComponent } from './pages/admin-list-product/admin-list-product.component';
import { AdminProductComponent } from './pages/admin-product/admin-product.component';
import { SuccessComponent } from './pages/success/success.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  { path: 'cart',component: CartComponent  },
  { path: 'home',component: HomeComponent },
  { path: 'product/:key', component: ProductComponent },
  { path: 'products-list', component: AdminListProductComponent, canActivate: [GuardService,AdminGuardService] },
  { path: 'add-product/:key', component: AdminProductComponent, canActivate: [GuardService, AdminGuardService] },
  { path: 'add-product', component: AdminProductComponent, canActivate: [GuardService, AdminGuardService] }, // Cambiando 'product' a 'producto'
  { path: '', component:LandingComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'success/:session_id', component: SuccessComponent },
  { path: 'orders', component: OrdersComponent, canActivate: [GuardService] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [GuardService] },
  { path: 'adminorders', component: AdminOrdersComponent, canActivate: [GuardService, AdminGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
