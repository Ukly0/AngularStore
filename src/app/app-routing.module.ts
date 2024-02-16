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

const routes: Routes = [
  { path: 'cart',component: CartComponent, canActivate: [GuardService] },
  { path: 'home',component: HomeComponent },
  { path: 'product/:key', component: ProductComponent },
  { path: 'products-list', component: AdminListProductComponent, canActivate: [GuardService,AdminGuardService] },
  { path: 'add-product/:key', component: AdminProductComponent, canActivate: [GuardService, AdminGuardService] },
  { path: 'add-product', component: AdminProductComponent, canActivate: [GuardService, AdminGuardService] }, // Cambiando 'product' a 'producto'
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
