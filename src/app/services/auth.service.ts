import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { GoogleAuthProvider, FacebookAuthProvider } from "@angular/fire/auth";
import { Observable, of, switchMap } from "rxjs";
import { UserService } from "./user.service";
import { User } from "../models/user.model";


@Injectable({
  providedIn: "root",
})
export class AuthService {
  getUserCartId(userid: string) {
    throw new Error("Method not implemented.");
  }

  public user$: Observable<firebase.User | null>;
  userKey: string | null = null;
  userEmail: string | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private userServ: UserService
  ) {
    this.user$ = afAuth.authState;
    this.user$.subscribe((user) => {
      if (user) {
        this.userKey = user.uid;
        this.userEmail = user.email;
        console.log("UserKey: ", this.userKey);
        console.log("UserEmail: ", this.userEmail);
      }
    });
  }

  // Iniciar sesión con correo electrónico y contraseña
  signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Cerrar sesión
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        if (credential.user) {
          return this.userServ.save(credential.user);
        } else {
          throw new Error("User was not created");
        }
      });
  }

  googleSignIn() {
    return this.afAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((res) => {
        // Comprobar este if que no se si es necesario
        if (res.user) {
          return this.userServ.save(res.user); // Add null as the second argument
        } else {
          throw new Error("User was not created");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  facebookSignIn() {
    return this.afAuth
      .signInWithPopup(new FacebookAuthProvider())
      .then((res) => {
        // Comprobar este if que no se si es necesario
        if (res.user) {
          return this.userServ.save(res.user); // Add null as the second argument
        } else {
          throw new Error("User was not created");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getUser(): Observable<User | null> {
    return this.afAuth.user.pipe(
      switchMap((user) =>
        user ? this.userServ.get(user.uid).valueChanges() : of(null)
      )
    );
  }

  getCurrentUserUid(): string | null {
    let user = firebase.auth().currentUser;
    return user ? user.uid : null;
  }

  logout() {
    return this.afAuth.signOut();
  }
}
