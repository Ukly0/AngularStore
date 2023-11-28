import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { CartComponent } from './pages/cart/cart.component';

const routes: Routes = [
  { path: 'cart',component: CartComponent },
  { path: 'home',component: HomeComponent },
  { path: 'product', component: ProductComponent }, // Cambiando 'product' a 'producto'
  { path: 'cart', component: CartComponent }, // Cambiando 'product' a 'producto'
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
