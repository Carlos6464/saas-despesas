import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard'; // Importe o Dashboard
import { Cadastro } from './pages/login/cadastro/cadastro'; // Importe o Cadastro

import { Categoria } from './pages/categoria/categoria';
import { Despesa } from './pages/despesa/despesa';

export const routes: Routes = [
  // 1. Redireciona a rota raiz ('') para '/login'
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Agrupa as rotas públicas sob o PublicLayout
  {
    path: '',
    component: PublicLayout, // Layout sem sidebar/header
    children: [
      { path: 'login', component: Login },
      { path: 'cadastro', component: Cadastro },
      // Outras rotas públicas, como 'esqueci-senha', iriam aqui
    ],
  },

  // 3. Agrupa as rotas protegidas sob o AuthLayout com um prefixo 'app'
  {
    path: 'app', // Todas as rotas aqui dentro começarão com /app/...
    component: AuthLayout, // Layout com sidebar/header
    // Futuramente, você adicionará um 'canActivate' aqui para proteger estas rotas
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'categorias', component: Categoria }, // Exemplo de rota protegida
      { path: 'despesas', component: Despesa },
      // Exemplo: { path: 'categorias', component: Categoria },
    ],
  },

  // 4. Rota de fallback: se o usuário digitar uma URL inválida, ele é enviado para o login
  { path: '**', redirectTo: 'login' },
];
