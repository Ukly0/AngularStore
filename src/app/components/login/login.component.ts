import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.css'
  ]
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  lname: string = '';
  fname: string = '';
  isRegistering = false;
  errorMessage: string = ''	;
  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
    
  ) { }

  ngOnInit(): void {
  }

  toggleRegistering(): void {
    this.isRegistering = !this.isRegistering;
  }

  signIn(): void {
    this.authService.signInWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        // Aquí puedes manejar el éxito del inicio de sesión
        console.log('Inicio de sesión exitoso', userCredential);
        this.dialogRef.close(); // Cierra el diálogo
        this.router.navigateByUrl(this.data.returnUrl); // Navega a la URL guardada

        
      })
      .catch((error) => {
        // Aquí puedes manejar los errores durante el inicio de sesión
        this.errorMessage = 'Failed to login. Please check your email and password.'
        console.error('Error en el inicio de sesión', error);
      });
  }

  register(): void {
    this.authService.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        // Aquí puedes manejar el éxito del registro
        console.log('Registro exitoso', userCredential);
        this.dialogRef.close(); // Cierra el diálogo
        this.router.navigateByUrl(this.data.returnUrl); // Navega a la URL guardada

      })
      .catch((error) => {
        // Aquí puedes manejar los errores durante el registro
        console.error('Error en el registro', error);
      });
  }

  
  signInWithGoogle() {
    this.authService.googleSignIn().then(() => {
      this.dialogRef.close();
      this.router.navigateByUrl(this.data.returnUrl); // Navega a la URL guardada

    }).catch((err) => {
      console.log(err);
    });
  }

  signInWithFacebook() {
    this.authService.facebookSignIn().then(() => {
      this.dialogRef.close();
      this.router.navigateByUrl(this.data.returnUrl); // Navega a la URL guardada

    }).catch((err) => {
      console.log(err);
    });
  }

  registerForm = this.formBuilder.group({
    fname: ['', [Validators.required, Validators.maxLength(15), Validators.pattern("^[a-zA-Z]+$")]],
    lname: ['', [Validators.required, Validators.maxLength(15), Validators.pattern("^[a-zA-Z]+$")]],
    email: ['',  [Validators.required, Validators.email]],
    password: ['',  [Validators.required, Validators.minLength(6)]]
  });

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['',  Validators.required]
  });


  

}
