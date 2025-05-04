import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<{ success: boolean, users: User[]}> {
    return this.http.get<{ success: boolean, users: User[]}>(`/api/users`);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`/api/user`, {
      params: { id }
    });
  }

  create(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`/api/add-user`, user);
  }

  update(user: User) {
    return this.http.patch<LoginResponse>(`/api/users`, user);
  }

  delete(id: string): Observable<{ success: boolean, message: string }> {
    return this.http.delete<{ success: boolean, message: string }>(`/api/users`, {
      params: { id }
    });
  }
}
