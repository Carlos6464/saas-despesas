import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../app/services/auth';
import { MessageService } from 'primeng/api';

/**
 * Guarda que protege as rotas, permitindo o acesso apenas a utilizadores autenticados.
 * Se o utilizador não estiver logado, é redirecionado para a página de login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (authService.isAuthenticated()) {
    return true; // Permite o acesso
  }

  // Se não estiver autenticado, redireciona para o login
  router.navigate(['/login']);
  messageService.add({
    severity: 'warn',
    summary: 'Acesso Negado',
    detail: 'Por favor, realize o login para continuar!',
    life: 3000,
  });
  return false; // Bloqueia o acesso
};
