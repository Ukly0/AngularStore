import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { GuardService } from './services/guard.service';
import { AdminGuardService } from './services/admin-guard.service';

const routes: Routes = [
  { path: 'cart',component: CartComponent, canActivate: [GuardService] },
  { path: 'home',component: HomeComponent },
  { path: 'product', component: ProductComponent, canActivate: [AdminGuardService] }, // Cambiando 'product' a 'producto'
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
