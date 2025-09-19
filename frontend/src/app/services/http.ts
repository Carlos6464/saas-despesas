import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class Http {
  // URL base única para toda a aplicação.
  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: Auth
  ) {}

  /**
   * Método POST para requisições 'x-www-form-urlencoded'.
   * Constrói a URL a partir da base + endpoint.
   */
  postUrlEncoded<T>(endpoint: string, data: any): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new HttpParams({ fromObject: data });

    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body.toString(), {
      headers,
    });
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(),
      params,
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(
      `${this.apiUrl}/${endpoint}`,
      JSON.stringify(data),
      {
        headers: this.getHeaders(),
      }
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(
      `${this.apiUrl}/${endpoint}`,
      JSON.stringify(data),
      {
        headers: this.getHeaders(),
      }
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(),
    });
  }
}
