import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from './login-service';

// Imports dos componentes PrimeNG que vamos usar no HTML
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api'; // Para exibir mensagens de erro
import { ToastModule } from 'primeng/toast'; // Módulo do Toast
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true, // Garante que o componente é autônomo
  imports: [
    ReactiveFormsModule, // Essencial para formulários reativos
    RouterLink, // Para o link de "Crie uma conta"
    InputTextModule, // Componente <input pInputText>
    ButtonModule, // Componente <p-button>
    CheckboxModule, // Componente <p-checkbox>
    FloatLabelModule, // Efeito de label flutuante
    ToastModule, // Para exibir o Toast de erro
  ],
  providers: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService, // Injeta o serviço de mensagens
    private auth: Auth
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/app/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.showError(
        'Formulário inválido',
        'Por favor, preencha todos os campos corretamente.'
      );
      return;
    }

    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    this.loginService.login({ username, password }).subscribe({
      next: () => {
        console.log('Login bem-sucedido!');
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        console.error('Falha no login', err);
        this.isLoading = false;
        // Exibe uma mensagem de erro amigável para o usuário
        this.showError(
          'Falha no Login',
          'Usuário ou senha inválidos. Tente novamente.'
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  // Função para exibir o Toast de erro
  private showError(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
    });
  }
}
