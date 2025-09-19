import { Component } from '@angular/core';

import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    PanelMenuModule,
    ButtonModule,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  // Variável para controlar a visibilidade do sidebar em telas menores
  sidebarVisible = false;

  constructor(
    private readonly authService: Auth,
    private readonly routes: Router
  ) {}

  // Estrutura do menu
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        link: '/app/dashboard',
      },
      {
        label: 'Categorias',
        icon: 'pi pi-fw pi-tags',
        link: '/app/categorias',
      },
      {
        label: 'despesas',
        icon: 'pi pi-fw pi-dollar',
        link: '/app/despesas', // Exemplo de outra rota
      },
      // {
      //   label: 'Cadastros',
      //   icon: 'pi pi-fw pi-file-edit',
      //   items: [],
      // },
      // {
      //   separator: true,
      // },
    ];
  }

  logout() {
    // Adicione sua lógica de logout aqui
    this.authService.logout();
    console.log('Usuário deslogado!');
    // Talvez redirecionar para a página de login
    this.routes.navigate(['/login']);
  }
}
