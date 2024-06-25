import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

describe('UserService', () => {
  let service: UserService;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      object: jasmine.createSpy('object').and.returnValue({
        valueChanges: () => of({}),
        update: jasmine.createSpy('update').and.returnValue(Promise.resolve()),
        remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
      }),
      list: jasmine.createSpy('list').and.returnValue({
        snapshotChanges: () => of([])
      })
    };

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AngularFireDatabase, useValue: mockDb },
      ],
    });

    service = TestBed.inject(UserService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('#isWishlisted debería llamar a db.object con los argumentos correctos', () => {
    service.isWishlisted('1', '1');
    expect(mockDb.object).toHaveBeenCalledWith('/users/1/wishlist/1');
  });

  it('#getWishlist debería llamar a db.list con los argumentos correctos', () => {
    service.getWishlist('1');
    expect(mockDb.list).toHaveBeenCalledWith('/users/1/wishlist');
  });

  it('#removeWishlist debería llamar a db.object con los argumentos correctos y luego llamar a remove', () => {
    service.removeWishlist('1', '1');
    expect(mockDb.object).toHaveBeenCalledWith('/users/1/wishlist/1');
    expect(mockDb.object().remove).toHaveBeenCalled();
  });

  it('#updateUserCartId debería llamar a db.object con los argumentos correctos y luego llamar a update con el cartId', () => {
    service.updateUserCartId('1', '1');
    expect(mockDb.object).toHaveBeenCalledWith('/users/1');
    expect(mockDb.object().update).toHaveBeenCalledWith({ cartId: '1' });
  });

  it('#getUserCartId debería llamar a db.object con los argumentos correctos', () => {
    service.getUserCartId('1');
    expect(mockDb.object).toHaveBeenCalledWith('/users/1/cartId');
  });
});