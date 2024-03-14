import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

// const apiKey = 'AIzaSyB394dDRg4X-4rihK6qEYAxPo6mRgIuvsY';

interface AuthResponseType {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  kind: string;
}

interface LoginResponseType extends AuthResponseType {
  registered: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  onSignup(email: string, password: string) {
    return this.http
      .post<AuthResponseType>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError((error) => {
          let errorMessage = '';

          if (!error.error || !error.error.error) {
            errorMessage = 'an error occurred';
            return throwError(() => new Error(errorMessage));
          }

          switch (error.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'this email is already present';
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResponseType>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError((error) => {
          let errorMessage = '';

          if (!error.error || !error.error.error) {
            errorMessage = 'an error occurred';
            return throwError(() => new Error(errorMessage));
          }

          switch (error.error.error.message) {
            case 'INVALID_LOGIN_CREDENTIALS':
              errorMessage = 'Wrong email or password';
          }

          return throwError(() => new Error(errorMessage));
        }),
        tap((responseData) => {
          const expireDate = new Date(
            new Date().getTime() + +responseData.expiresIn * 1000
          );

          const userData = new User(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            expireDate
          );

          this.user.next(userData);
          this.autoLogout(+responseData.expiresIn * 1000);
          localStorage.setItem('userData', JSON.stringify(userData));
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _expireDate: Date;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const userLoadedData = new User(
      userData.email,
      userData.id,
      userData._token,
      userData._expireDate
    );

    if (userLoadedData.token) {
      this.user.next(userLoadedData);
      const remainingTime =
        new Date(userData._expireDate).getTime() - new Date().getTime();
      this.autoLogout(remainingTime);
    }
  }

  autoLogout(expireTime: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expireTime);
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.tokenTimer) clearTimeout(this.tokenTimer);
  }
}
