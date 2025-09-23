import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Auth } from './auth';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class Http {
  // URL base única para toda a aplicação.
  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: Auth,
    private readonly router: Router,
    private readonly messageService: MessageService
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

    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, body.toString(), {
        headers,
      })
      .pipe(catchError(this.handleError.bind(this)));
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
    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        params,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, JSON.stringify(data), {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}/${endpoint}`, JSON.stringify(data), {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.apiUrl}/${endpoint}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Manipulador de erros centralizado para todas as requisições HTTP.
   * @param error O erro HTTP recebido.
   * @returns Um Observable que emite o erro para ser tratado posteriormente, se necessário.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Se o erro for 401 (Não Autorizado), significa que o token é inválido ou expirou.
    if (error.status === 401) {
      console.log('Token expirado ou inválido. A deslogar...');
      this.messageService.add({
        severity: 'warn',
        summary: 'Sessão Expirada',
        detail: 'O seu acesso expirou. Por favor, faça login novamente.',
        life: 3000,
      });

      // Limpa os dados de autenticação do storage
      this.authService.logout();

      // Redireciona para a página de login após um breve momento
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }

    // Propaga o erro para que os componentes possam tratá-lo localmente, se necessário.
    return throwError(() => error);
  }
}
