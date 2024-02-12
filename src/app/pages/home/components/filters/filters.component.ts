import { Component,  OnDestroy,  OnInit,  } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { map, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  templateUrl:'filters.component.html',
  styleUrls: ['filters.component.css']
})
export class FiltersComponent implements OnInit, OnDestroy {
  
  private destroy$ = new Subject<void>();

  categories$ = this.mapFirebaseActions(this.categoryService.getCategories());
  themes$ = this.mapFirebaseActions(this.categoryService.getThemes());
  selectedCategory: string | null | undefined;
  selectedTheme: string | null | undefined;

  constructor( private categoryService: CategoryService) { 
  }

  private mapFirebaseActions(observable: any) {
    return observable
      .snapshotChanges()
      .pipe(map((actions: any[]) => actions.map(this.mapAction)));
  }
  
  private mapAction(action: any) {
    return { key: action.key, ...action.payload.val() };
  }
  
  ngOnInit(): void {
    this.categoryService.selectedCategory$.pipe(takeUntil(this.destroy$)).subscribe(category => {
      this.selectedCategory = category;
    });

    this.categoryService.selectedTheme$.pipe(takeUntil(this.destroy$)).subscribe(theme => {
      this.selectedTheme = theme;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectCategory(category: string) {
    this.categoryService.selectCategory(category);
  }

  selectTheme(theme: string) {
    this.categoryService.selectTheme(theme);
  }

}
