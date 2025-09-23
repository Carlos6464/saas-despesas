import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../shared/models/user.model'; // Importe a nova interface

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'current_user'; // Nova chave para o usuário
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Salva o token de acesso no localStorage.
   */
  saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Recupera o token de acesso do localStorage.
   */
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * NOVO: Salva o objeto do usuário no localStorage.
   * O objeto é convertido para uma string JSON antes de ser salvo.
   */
  saveUser(user: User): void {
    if (this.isBrowser) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * NOVO: Recupera o objeto do usuário do localStorage.
   * A string JSON é convertida de volta para um objeto.
   */
  getUser(): User | null {
    if (this.isBrowser) {
      const userString = localStorage.getItem(this.USER_KEY);
      if (userString) {
        try {
          return JSON.parse(userString) as User;
        } catch (e) {
          console.error('Erro ao parsear dados do usuário do localStorage', e);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * ATUALIZADO: Remove o token E o usuário do localStorage.
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY); // Limpa também o usuário
    }
  }

  /**
   * Verifica se o usuário possui um token armazenado.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
