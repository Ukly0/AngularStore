import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import { GoogleAuthProvider } from "firebase/auth";


describe('AuthService', () => {
  let service: AuthService;
  let mockAuth: any;
  let mockUserServ: any;

  beforeEach(() => {
    mockAuth = {
      signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword').and.returnValue(Promise.resolve()),
      signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve()),
      createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword').and.returnValue(Promise.resolve({ user: {} })),
      signInWithPopup: jasmine.createSpy('signInWithPopup').and.returnValue(Promise.resolve({ user: {} })),
    };

    mockUserServ = {
      save: jasmine.createSpy('save').and.returnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: mockAuth },
        { provide: UserService, useValue: mockUserServ },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('El servicio debería', () => {
    expect(service).toBeTruthy();
  });

  it('#signInWithEmailAndPassword debería llamar a afAuth.signInWithEmailAndPassword con los argumentos correctos', async () => {
    await service.signInWithEmailAndPassword('test@test.com', 'password');
    expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@test.com', 'password');
  });

  it('#signOut debería llamar a afAuth.signOut', async () => {
    await service.signOut();
    expect(mockAuth.signOut).toHaveBeenCalled();
  });

  it('#createUserWithEmailAndPassword debería llamar a afAuth.createUserWithEmailAndPassword con los argumentos correctos y luego llamar a userServ.save con el usuario creado', async () => {
    await service.createUserWithEmailAndPassword('test@test.com', 'password');
    expect(mockAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith('test@test.com', 'password');
    expect(mockUserServ.save).toHaveBeenCalledWith({});
  });

  it('#googleSignIn debería llamar a afAuth.signInWithPopup con GoogleAuthProvider y luego llamar a userServ.save con el usuario creado', async () => {
    await service.googleSignIn();
    expect(mockAuth.signInWithPopup).toHaveBeenCalledWith(new GoogleAuthProvider());
    expect(mockUserServ.save).toHaveBeenCalledWith({});
  });
});