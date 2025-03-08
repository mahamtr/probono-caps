import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AgentRole } from '../constants/constants';

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
    return false;
    return this.userRole === AgentRole.Admin;
  }

  isProfessional(): boolean {
    return true;
    return this.userRole === AgentRole.Professional;
  }

  isIntern(): boolean {
    return false;
    return this.userRole === AgentRole.Intern;
  }

  canDeleteAppointment(): boolean {
    return this.isAdmin();
  }

  canEditAppointment(): boolean {
    return this.isAdmin() || this.isProfessional() || this.isIntern();
  }

  canCreateAppointment(): boolean {
    return this.isAdmin() || this.isIntern() || this.isProfessional();
  }

  canDeletePatient(): boolean {
    return this.isAdmin() || this.isProfessional();
  }

  canEditPatient(): boolean {
    return this.isAdmin() || this.isProfessional() || this.isIntern();
  }

  canCreatePatient(): boolean {
    return this.isAdmin() || this.isProfessional() || this.isIntern();
  }

  canEnablePatient(): boolean {
    return this.isAdmin() || this.isProfessional();
  }

  // Agent permissions
  canDeleteAgent(): boolean {
    return this.isAdmin();
  }

  canEditAgent(): boolean {
    return this.isAdmin() || this.isProfessional();
  }

  canCreateAgent(): boolean {
    return this.isAdmin();
  }

  canUpdateSecurity(): boolean {
    return this.isAdmin();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    this.userRole = '';
    this.router.navigate(['/login']);
  }
}
