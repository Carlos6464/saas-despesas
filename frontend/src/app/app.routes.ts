import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Cadastro } from './pages/login/cadastro/cadastro';
import { Categoria } from './pages/categoria/categoria';
import { Despesa } from './pages/despesa/despesa';
import { Adicionar as CategoriaAdicionar } from './pages/categoria/adicionar/adicionar';

import { InvalidoComponent } from './pages/invalido/invalido.component';

// Importe o AuthGuard que acabamos de criar
import { authGuard } from '../guard/auth.guard';

export const routes: Routes = [
  // --- ROTAS PÚBLICAS ---
  // Acessíveis sem login, renderizadas dentro do PublicLayout (um layout simples)
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'cadastro', component: Cadastro },
      { path: 'invalido/:code', component: InvalidoComponent },
    ],
  },

  {
    path: 'app',
    component: AuthLayout,
    canActivate: [authGuard], // A MÁGICA ACONTECE AQUI!
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },

      // Rotas de Categoria aninhadas
      {
        path: 'categorias',
        children: [
          { path: '', component: Categoria }, // Rota principal: /app/categorias
          { path: 'adicionar', component: CategoriaAdicionar }, // Rota: /app/categorias/adicionar
          { path: 'editar/:id', component: CategoriaAdicionar }, // Rota: /app/categorias/editar/123
        ],
      },

      { path: 'despesas', component: Despesa },
    ],
  },

  // Rota de fallback: se o usuário digitar algo que não existe, volta para o login
  { path: '**', redirectTo: 'invalido/404' },
];
