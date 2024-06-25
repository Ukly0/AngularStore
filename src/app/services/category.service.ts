import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  selectedCategorySource = new BehaviorSubject<string | null>(null);
  selectedThemeSource = new BehaviorSubject<string | null>(null);

  selectedCategory$ = this.selectedCategorySource.asObservable();
  selectedTheme$ = this.selectedThemeSource.asObservable();

  constructor(private db: AngularFireDatabase) {}

  getCategories() {
    return this.db.list("/category", (ref) => ref.orderByChild("name"));
  }

  getThemes() {
    return this.db.list("/theme", (ref) => ref.orderByChild("name"));
  }

  getColor() {
    return this.db.list("/color", (ref) => ref.orderByChild("name"));
  }

  getSize() {
    return this.db.list("/size", (ref) => ref);
  }

  selectCategory(category: string) {
    if (this.selectedCategorySource.value === category) {
      this.selectedCategorySource.next(null); // Deseleccionar la categoría
    } else {
      this.selectedCategorySource.next(category); // Seleccionar la categoría
    }
  }

  selectTheme(theme: string) {
    if (this.selectedThemeSource.value === theme) {
      this.selectedThemeSource.next(null); // Deseleccionar la categoría
    } else {
      this.selectedThemeSource.next(theme); // Seleccionar la categoría
    }
  }
}
