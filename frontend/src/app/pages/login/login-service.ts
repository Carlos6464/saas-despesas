import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Auth } from '../../services/auth';
import { Http } from '../../services/http';
import { User } from '../../shared/models/user.model';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // Apenas o caminho do endpoint, a URL base fica no HttpService
  private readonly loginEndpoint = 'v1/login';

  constructor(
    private readonly httpService: Http,
    private readonly authService: Auth
  ) {}

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    // Passamos apenas o endpoint para o método do HttpService
    return this.httpService
      .postUrlEncoded<LoginResponse>(this.loginEndpoint, credentials)
      .pipe(
        tap((response) => {
          this.authService.saveToken(response.access_token);
          this.authService.saveUser(response.user);
        })
      );
  }
}
