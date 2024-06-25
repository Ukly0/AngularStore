import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

describe('ProductService', () => {
  let service: ProductService;
  let mockDb: any;
  let mockStorage: any;

  beforeEach(() => {
    mockDb = {
      list: jasmine.createSpy('list').and.returnValue({
        push: jasmine.createSpy('push').and.returnValue(Promise.resolve()),
        snapshotChanges: () => of([]),
        remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
      }),
      object: jasmine.createSpy('object').and.returnValue({
        snapshotChanges: () => of({}),
        update: jasmine.createSpy('update').and.returnValue(Promise.resolve()),
        remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
        
      })
    };

    mockStorage = {
      refFromURL: jasmine.createSpy('refFromURL').and.returnValue({
        delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve())
      })
    };

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: AngularFireDatabase, useValue: mockDb },
        { provide: AngularFireStorage, useValue: mockStorage },
      ],
    });

    service = TestBed.inject(ProductService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('#create debería llamar a db.list con los argumentos correctos y luego llamar a push con el producto', () => {
    const product = { name: 'Test product' };
    service.create(product);
    expect(mockDb.list).toHaveBeenCalledWith('/product');
    expect(mockDb.list().push).toHaveBeenCalledWith(product);
  });

  it('#getAllProducts debería llamar a db.list con los argumentos correctos', () => {
    service.getAllProducts();
    expect(mockDb.list).toHaveBeenCalledWith('/product');
  });

  it('#get debería llamar a db.object con los argumentos correctos', () => {
    service.get('1');
    expect(mockDb.object).toHaveBeenCalledWith('/product/1');
  });

  it('#get debería devolver un producto no nulo', (done) => {
    const mockProduct = { key: '1', name: 'Product 1' };
    mockDb.object.and.returnValue({
      snapshotChanges: () => of({ payload: { val: () => mockProduct } })
    });
  
    service.get('1').subscribe(product => {
      expect(product).not.toBeNull();
      done();
    });
  
    expect(mockDb.object).toHaveBeenCalledWith('/product/1');
  });
  
  it('#update debería llamar a db.object con los argumentos correctos y luego llamar a update con el producto', () => {
    const product = { name: 'Updated product' };
    service.update('1', product);
    expect(mockDb.object).toHaveBeenCalledWith('/product/1');
    expect(mockDb.object().update).toHaveBeenCalledWith(product);
  });


  it('#getOffer debería llamar a db.list con los argumentos correctos', () => {
    service.getOffer();
    expect(mockDb.list).toHaveBeenCalledWith('/product');
  });
});