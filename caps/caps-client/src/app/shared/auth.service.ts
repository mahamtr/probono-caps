import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface AuthResponse {
  accessToken: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: string = '';

  constructor(private apiService: ApiService, private router: Router) {
    this.userRole = localStorage.getItem('userRole') || '';
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(
      'api/agent/authenticate',
      credentials
    );
  }

  saveAuthResponse(response: AuthResponse): void {
    localStorage.setItem('authToken', response.accessToken);
    localStorage.setItem('userRole', response.role);
    this.userRole = response.role;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    this.userRole = '';
    this.router.navigate(['/login']);
  }
}
