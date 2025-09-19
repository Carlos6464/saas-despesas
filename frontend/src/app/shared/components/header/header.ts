import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../services/auth';

// Imports do PrimeNG
import { AvatarModule } from 'primeng/avatar';
import { PopoverModule } from 'primeng/popover';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AvatarModule, PopoverModule, RouterModule, RippleModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
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
