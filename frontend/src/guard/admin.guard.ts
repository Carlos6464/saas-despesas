import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../app/services/auth'; // Ajuste o caminho se necessário
import { MessageService } from 'primeng/api';

/**
 * Guarda que protege rotas, permitindo o acesso apenas a utilizadores que são administradores.
 * Se o utilizador não for admin, é redirecionado para o dashboard principal.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const messageService = inject(MessageService);

  // Usamos a função que verifica se o usuário é admin
  if (authService.isSuperAdmin()) {
    return true; // Permite o acesso, pois é um admin
  }

  // Se não for admin, redireciona para uma página segura (como o dashboard)
  // e exibe uma mensagem de erro. Não o mandamos para o login, pois ele já está logado.
  router.navigate(['/app/dashboard']);
  messageService.add({
    severity: 'error',
    summary: 'Acesso Restrito',
    detail: 'Você não tem permissão para acessar esta página!',
    life: 3000,
  });

  return false; // Bloqueia o acesso
};
