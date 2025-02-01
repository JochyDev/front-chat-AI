import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl + '/auth'

  set accessToken(token: string)
  {
      localStorage.setItem('accessToken', token);
  }

  get accessToken(): string
  {
      return localStorage.getItem('accessToken') ?? '';
  }

  set user(value: User)
  {
      localStorage.setItem('user', JSON.stringify(value));
  }

  get user(): User
  {
      return JSON.parse(localStorage.getItem('user') ?? '');
  }

  constructor(
    private readonly _httpClient: HttpClient
  ) { }

  signIn(credentials: { name: string; password: string }): Observable<any> {
    return this._httpClient.post(`${this.apiUrl}/login`, credentials ).pipe(
        catchError((error) => {

            let errorMessage = 'Error en el inicio de sesión';

            if (error && error.error && error.error.message) {
                errorMessage = error.error.message;
            }

            return throwError({ error: error });
        }),
        switchMap((response: any) => {
            if (response.error) {
                return throwError({ error: true, message: response.error });
            } else {
                this.accessToken = response.token;

                const {token, ...user} = response;
                this.user = user;

                return of(response);
            }
        })
    );
  }

  signUp(credentials: { name: string; password: string }): Observable<any>
  {
      return this._httpClient.post(`${this.apiUrl}/register`, credentials);
  }


  
  getAllUser(): Observable<User[]>{
    return this._httpClient.get<User[]>(`${this.apiUrl}/user`);
  }


}
