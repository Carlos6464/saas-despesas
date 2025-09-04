import { Component } from '@angular/core';


import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    PanelMenuModule,
    ButtonModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  // Variável para controlar a visibilidade do sidebar em telas menores
  sidebarVisible = false;

  // Estrutura do menu
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/app/dashboard']
      },
      {
        label: 'Cadastros',
        icon: 'pi pi-fw pi-file-edit',
        items: [
          {
            label: 'Produtos',
            icon: 'pi pi-fw pi-box',
            routerLink: ['/app/products']
          },
          {
            label: 'Clientes',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/app/customers'] // Exemplo de outra rota
          }
        ]
      },
      {
        label: 'Relatórios',
        icon: 'pi pi-fw pi-chart-bar',
        items: [
          {
            label: 'Vendas',
            icon: 'pi pi-fw pi-chart-line'
          },
          {
            label: 'Estoque',
            icon: 'pi pi-fw pi-table'
          }
        ]
      },
      {
        label: 'Configurações',
        icon: 'pi pi-fw pi-cog'
      },
      {
        separator: true
      },
      {
        label: 'Sair',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.logout() // Chama uma função ao clicar
      }
    ];
  }

  logout() {
    // Adicione sua lógica de logout aqui
    console.log('Usuário deslogado!');
  }


}
