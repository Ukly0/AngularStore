import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from './login.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import firebase from 'firebase/compat';
import { fakeAsync, tick } from '@angular/core/testing';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<LoginComponent>>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signInWithEmailAndPassword', 'createUserWithEmailAndPassword', 'googleSignIn', 'facebookSignIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<LoginComponent>>;
    fixture.detectChanges();
  });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle isRegistering', () => {
        component.toggleRegistering();
        expect(component.isRegistering).toBeTrue();
    });

      
      it('Debe llamar a createUserWithEmailAndPassword cuando registro es llamado', () => {
        authService.createUserWithEmailAndPassword.and.returnValue(Promise.resolve());
        component.email = 'test@test.com';
        component.password = 'password';
        component.register();
        expect(authService.createUserWithEmailAndPassword).toHaveBeenCalledWith('test@test.com', 'password');
      });
      
      it('Debe aparecer error de registro', fakeAsync(() => {
        const error = { message: 'Failed to Register. Please check your email and password.' };
        authService.createUserWithEmailAndPassword.and.returnValue(Promise.reject(error));
        component.email = 'alberto@gmail.com';
        component.password = '123456789';
        
        component.register();
        tick(); // Simula el paso del tiempo para que se resuelvan todas las promesas pendientes
        
        fixture.detectChanges();
        expect(component.errorMessage).toBe('Failed to Register. Please check your email and password.');
      }));

      it('Debe aparecer Error de LogIn', fakeAsync(() => {
        const error = { message: 'Failed to login. Please check your email and password.' };
        authService.signInWithEmailAndPassword.and.returnValue(Promise.reject(error));
        component.email = 'alberto@gmail.com';
        component.password = 'password';
        
        component.signIn();
        tick(); // Simula el paso del tiempo para que se resuelvan todas las promesas pendientes
        
        fixture.detectChanges();
        expect(component.errorMessage).toBe('Failed to login. Please check your email and password.');
      }));

      it('No debe aparecer error de registro', fakeAsync(() => {
        authService.createUserWithEmailAndPassword.and.returnValue(Promise.resolve());
        component.email = 'alberto@gmail.com';
        component.password = '123456789';
        
        component.register();
        tick(); // Simula el paso del tiempo para que se resuelvan todas las promesas pendientes
        
        fixture.detectChanges();
        expect(component.errorMessage).toBe('');
      }));


    it('Deberia validar email con todas sus restricciones', () => {
        let email = component.loginForm.get('email');
        
        if (email) {
            email.setValue(''); // establecer un valor vacío
            expect(email.valid).toBeFalsy(); // debería ser inválido porque el email es requerido
            
            email.setValue('alberto@gmail.com');
            expect(email.valid).toBeTruthy(); // debería ser válido ahora que hemos establecido un valor

            email.setValue('alberto');
            expect(email.valid).toBeFalse(); // debería ser válido ahora que hemos establecido un valor
        }
    });
      
    it('Deberia validar paswword con todas sus restricciones', () => {
        let password = component.loginForm.get('password');
        
        if (password) {
            password.setValue(''); // establecer un valor vacío
            expect(password.valid).toBeFalsy(); // debería ser inválido porque la contraseña es requerida
            
            password.setValue('123456789');
            expect(password.valid).toBeTruthy(); // debería ser válido ahora que hemos establecido un valor
        }
    });



    
});