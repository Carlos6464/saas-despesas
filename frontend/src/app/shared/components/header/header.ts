import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../services/auth';
import { LayoutService } from '../../../services/layout-service'; // Importe o novo serviço

// Imports do PrimeNG
import { AvatarModule } from 'primeng/avatar';
import { PopoverModule } from 'primeng/popover';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button'; // Módulo para o botão de menu

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AvatarModule,
    PopoverModule,
    RouterModule,
    RippleModule,
    ButtonModule,
  ], // Adicione o ButtonModule
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // Injeta o serviço de layout
  layoutService = inject(LayoutService);

  constructor(
    private readonly authService: Auth,
    private readonly router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    console.log('Usuário deslogado!');
  }
}
