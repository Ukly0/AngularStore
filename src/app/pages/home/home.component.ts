import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.css'],

})
export class HomeComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  productsSubscription: Subscription;
  private breakpointObserverSubscription: Subscription;
  products: Product[] = [];
  filter: any[] = [];
  productsFilteredByCategory: any[] = [];

  selectedCategory: string | null | undefined;
  selectedTheme: string | null | undefined;

  showFilters = false;

  constructor(private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private categoryService: CategoryService) {

    this.cols = this.calculateCols(window.innerWidth);

    this.breakpointObserverSubscription = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .subscribe((state: BreakpointState) => {
        this.cols = this.calculateCols(window.innerWidth);
      });

    this.productsSubscription = this.productService.getAllProducts().subscribe((products: Product[]) => {
      this.filter = this.products = products;
    });
  }
  category: string | undefined;
  cols = 3;

  ngOnInit() {
    this.productService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe(products => {
      this.products = products;
      this.productsFilteredByCategory = products;
      this.filterProducts();
    });
  
    this.categoryService.selectedCategory$.pipe(takeUntil(this.destroy$)).subscribe(category => {
      this.selectedCategory = category;
      if (category) {
        this.productsFilteredByCategory = this.products.filter(product => product.categories === this.selectedCategory);
      } else {
        this.productsFilteredByCategory = this.products;
      }
      this.filterProducts();
    });

    this.categoryService.selectedTheme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.selectedTheme = theme;
      this.filterProducts();
    });
  }
  
  ngOnDestroy() {
    this.breakpointObserverSubscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  filtertable(query: string) {
    console.log(query);
    this.filter = (query) ?
      this.productsFilteredByCategory.filter((p: { title: string; }) => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.productsFilteredByCategory;
    console.log(this.filter);

    
  }

  filterProducts() {
   let filteredProducts = this.products;

  if (this.selectedCategory) {
    filteredProducts = filteredProducts.filter(product => product.categories === this.selectedCategory);
  }
  
  if (this.selectedTheme) {
    console.log(this.selectedTheme);
    filteredProducts = filteredProducts.filter(product => product.themes && product.themes.includes(this.selectedTheme!));
  }

  this.filter = filteredProducts;
  }

  private calculateCols(windowWidth: number): number {
    if (windowWidth >= 1200) {
      return 4;
    } else if (windowWidth >= 1000) {
      return 3;
    } else if (windowWidth >= 600) {
      return 2;
    } else {
      return 1;
    }
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }


  

}
