import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CategoryService } from "src/app/services/category.service";
import { Product } from "src/app/models/product.model";
import { Subscription, finalize, map } from "rxjs";
import { ProductService } from "src/app/services/product.service";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { lastValueFrom } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-admin-product",
  templateUrl: "admin-product.component.html",

  styleUrls: ["admin-product.component.css"],
})
export class AdminProductComponent implements OnInit, OnDestroy {
  @ViewChild("fileInput") fileInput: any;

  product: Product = {} as Product;
  imagePreviews: string[] = [];
  files: File[] = [];
  categories$ = this.mapFirebaseActions(this.categoryService.getCategories());
  themes$ = this.mapFirebaseActions(this.categoryService.getThemes());
  colors$ = this.mapFirebaseActions(this.categoryService.getColor());
  sizes$ = this.mapFirebaseActions(this.categoryService.getSize());
  imageUrls: string[] = []; // Aquí se almacenarán las URLs de las imágenes
  productSubscription: Subscription = new Subscription();
  id;
  constructor(
    private storage: AngularFireStorage,
    private categoryService: CategoryService,
    private productoService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get("key");
    if (this.id)
      this.productSubscription = this.productoService
        .get(this.id)
        .subscribe((p) => (this.product = p));
    console.log(this.product);
  }

  private mapFirebaseActions(observable: any) {
    return observable
      .snapshotChanges()
      .pipe(map((actions: any[]) => actions.map(this.mapAction)));
  }

  private mapAction(action: any) {
    return { key: action.key, ...action.payload.val() };
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }

  async save(product: Product) {
    if (this.files && this.files.length) {
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        if (file) {
          const filePath = `images/${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          // Espera a que la tarea de subida se complete
          const snapshotChanges$ = task.snapshotChanges().pipe(
            finalize(async () => {
              const url = await lastValueFrom(fileRef.getDownloadURL());
              console.log(url); // this is the URL of the image that you can use in your app
              this.imageUrls.push(url); // Guarda la URL de descarga en imageUrls

              if (this.files && this.imageUrls.length === this.files.length) {
                // Todos los archivos se han subido, así que guarda el producto
                product.images = this.imageUrls; // Añade las URLs de las imágenes al producto
                if (this.id) this.productoService.update(this.id, product);
                else this.productoService.create(product);
                this.router.navigate(["/admin/list-product"]);
              }
            })
          );

          await lastValueFrom(snapshotChanges$);
        }
      }
    } else {
      // No hay archivos para subir, así que guarda el producto
      if (this.id) this.productoService.update(this.id, product);
      else this.productoService.create(product);

      this.router.navigate(["/admin/list-product"]);
    }
  }

  onFileChange(event: any) {
    const newFiles = Array.from(event.target.files);

    for (let i = 0; i < newFiles.length; i++) {
      const file: File = newFiles[i] as File;

      // Generate a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.imagePreviews.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }

    // Add the new files to the existing files array
    this.files = [...this.files, ...(newFiles as File[])];
  }

  onDelete(index: number) {
    // Check if index is valid
    if (
      index >= 0 &&
      index < this.files.length &&
      index < this.imagePreviews.length
    ) {
      // Remove the image from files and imagePreviews
      this.files.splice(index, 1);
      this.imagePreviews.splice(index, 1);

      this.fileInput.nativeElement.value = "";
    } else {
      console.error("Invalid index: ", index);
    }
  }
}
