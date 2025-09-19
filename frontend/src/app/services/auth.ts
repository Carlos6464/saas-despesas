import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'access_token';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Salva o token de acesso no localStorage.
   * @param token O token JWT recebido da API.
   */
  saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Recupera o token de acesso do localStorage.
   * @returns O token JWT ou null se não existir.
   */
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Remove o token do localStorage (efetua o logout no lado do cliente).
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Verifica se o usuário possui um token armazenado.
   * @returns True se o token existir, false caso contrário.
   */
  isAuthenticated(): boolean {
    // A dupla negação (!!) transforma o valor (string ou null) em um booleano.
    return !!this.getToken();
  }
}
