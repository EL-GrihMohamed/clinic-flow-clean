import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/login-response.model';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private rolesSubject = new BehaviorSubject<string[]>([]);
  public userRoles$: Observable<string[]> = this.rolesSubject.asObservable();

  constructor(private http: HttpClient,
    private storage: LocalStorageService
  ) { }

  public login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`/api/signin`, {
      username, password
    });
  }

  public getProfile(): Observable<{ success: boolean, user: User }> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.get<{ success: boolean, user: User }>(`/api/user/me`, { headers });
  }

  public UpdateProfile(profile: User): Observable<{success: boolean, message: string}> {
    return this.http.patch<{success: boolean, message: string}>(`/api/user/me`, profile);
  }

  getRoles(): string[] {
    return this.rolesSubject.value;
  }

  setRoles(roles: string[]) {
    this.rolesSubject.next(roles);
  }

  public logout(){
    this.storage.cleanToken();
  }
}
