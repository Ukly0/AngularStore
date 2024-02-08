import { Component,  OnInit,  } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-filters',
  templateUrl:'filters.component.html',
  styleUrls: ['filters.component.css']
})
export class FiltersComponent implements OnInit {
  
  categories$ = this.mapFirebaseActions(this.categoryService.getCategories());
  themes$ = this.mapFirebaseActions(this.categoryService.getThemes());

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
  }

}
