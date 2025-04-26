import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/login-response.model';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(userName: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`/api/signin`, {
      userName, password
    });
  }

  public getUser(): Observable<User> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.get<User>(`/api/user/me`, { headers });
  }
}
