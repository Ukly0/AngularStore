import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { LayoutModule } from "@angular/cdk/layout";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatBadgeModule } from "@angular/material/badge";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./pages/home/home.component";
import { ProductsHeaderComponent } from "./pages/home/components/products-header/products-header.component";
import { FiltersComponent } from "./pages/home/components/filters/filters.component";
import { ProductBoxComponent } from "./pages/home/components/product-box/product-box.component";
import { ProductComponent } from "./pages/product/product.component";
import { CartComponent } from "./pages/cart/cart.component";
import { FormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { ReactiveFormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { LoginComponent } from "./components/login/login.component";
import { AuthService } from "./services/auth.service";
import { GuardService } from "./services/guard.service";
import { AdminGuardService } from "./services/admin-guard.service";
import { UserService } from "./services/user.service";
import { AdminListProductComponent } from "./pages/admin-list-product/admin-list-product.component";
import { AdminProductComponent } from "./pages/admin-product/admin-product.component";
import { CategoryService } from "./services/category.service";
import { ProductService } from "./services/product.service";
import { CartService } from "./services/cart.service";
import { provideStorage, getStorage } from "@angular/fire/storage";
import { HttpClientModule } from "@angular/common/http";
import { OrderService } from "./services/order.service";  

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ProductsHeaderComponent,
    FiltersComponent,
    ProductBoxComponent,
    ProductComponent,
    CartComponent,
    LoginComponent,
    AdminListProductComponent,
    AdminProductComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    provideStorage(() => getStorage()),
    AngularFireAuthModule,
    HttpClientModule,
    AngularFirestoreModule,
    LayoutModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    OrderService,
    CartService,
    UserService,
    AuthService,
    AdminGuardService,
    GuardService,
    CategoryService,
    ProductService,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
