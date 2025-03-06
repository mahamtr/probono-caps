import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080'; // TODO make this come from enviroment

  constructor(private http: HttpClient) {}

  get<T>(
    url: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    const options = { params, headers };
    return this.http.get<T>(`${this.baseUrl}/${url}`, options);
  }

  getBlob(
    url: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<Blob> {
    const options = { params, headers, responseType: 'blob' as const };
    return this.http.get(`${this.baseUrl}/${url}`, options);
  }

  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    const options = { headers };
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, options);
  }

  patch<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    const options = { headers };
    return this.http.patch<T>(`${this.baseUrl}/${url}`, body, options);
  }

  delete<T>(url: string, body: any): Observable<HttpEvent<T>> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`, body);
  }
}
