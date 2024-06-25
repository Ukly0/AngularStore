import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { HttpClient } from '@angular/common/http';

describe('OrderService', () => {
  let service: OrderService;
  let mockDb: any;
  let mockHttp: any;

  beforeEach(() => {
    mockDb = {
      list: jasmine.createSpy('list').and.returnValue({
        valueChanges: () => of([]),
        snapshotChanges: () => of([]),
        update: jasmine.createSpy('update').and.returnValue(Promise.resolve()),
        remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
      }),
      object: jasmine.createSpy('object').and.returnValue({
        update: jasmine.createSpy('update').and.returnValue(Promise.resolve()),
        remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
      })
    };

    mockHttp = {
      post: jasmine.createSpy('post').and.returnValue(of({}))
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrderService,
        { provide: AngularFireDatabase, useValue: mockDb },
        { provide: HttpClient, useValue: mockHttp },
      ],
    });

    service = TestBed.inject(OrderService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('#getOrderByEmail debería llamar a db.list con los argumentos correctos', () => {
    service.getOrderByEmail('test@test.com');
    expect(mockDb.list).toHaveBeenCalledWith('/orders', jasmine.any(Function));
  });

  it('#updateshipping debería llamar a db.object con los argumentos correctos y luego llamar a update con el envío', () => {
    const shipping = { address: '123 Main St' };
    service.updateshipping('1', shipping);
    expect(mockDb.object).toHaveBeenCalledWith('/orders/1');
    expect(mockDb.object().update).toHaveBeenCalledWith({ shipping: shipping });
  });

  it('#sendEmail debería llamar a http.post con los argumentos correctos', () => {
    const emailData = { to: 'test@test.com', message: 'Test message' };
    const expectedPostData = {
      order: emailData,
      changes: 'Test message',
      email: undefined
    };
    service.sendEmail(emailData, 'Test message');
    expect(mockHttp.post).toHaveBeenCalledWith('http://localhost:4242/email/update', expectedPostData);
  });
});