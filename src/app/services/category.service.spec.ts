import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
describe('CategoryService', () => {
  let service: CategoryService;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      list: jasmine.createSpy('list').and.returnValue({
        valueChanges: () => of([]),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: AngularFireDatabase, useValue: mockDb },
      ],
    });

    service = TestBed.inject(CategoryService);
  });

  it('deberia ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('#getSize deberia llamar a db.list', () => {
    service.getSize();
    expect(mockDb.list).toHaveBeenCalledWith('/size', jasmine.any(Function));
  });

  it('#selectCategory deberia ser null cuando la categoria ya esta seleccionada', () => {
    service.selectedCategorySource.next('test');
    service.selectCategory('test');
    service.selectedCategorySource.subscribe((value) => {
      expect(value).toBeNull();
    });
  });

  it('#selectCategory  no deberia ser null cuando otra categoria  esta seleccionada', () => {
    service.selectedCategorySource.next('test');
    service.selectCategory('different');
    service.selectedCategorySource.subscribe((value) => {
      expect(value).toEqual('different');
    });
  });

  it('#selectTheme no deberia seleccionar un tema diferente cuando este ya esta seleccionado', () => {
    service.selectedThemeSource.next('test');
    service.selectTheme('test');
    service.selectedThemeSource.subscribe((value) => {
      expect(value).toBeNull();
    });
  });

  it('#selectTheme deberia seleccionar un tema diferente cuando este ya esta seleccionado', () => {
    service.selectedThemeSource.next('test');
    service.selectTheme('different');
    service.selectedThemeSource.subscribe((value) => {
      expect(value).toEqual('different');
    });
  });
});