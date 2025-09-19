import { Component, inject } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../services/layout-service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [Header, RouterOutlet, Sidebar, NgClass],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  private layoutService = inject(LayoutService);
  // Garanta que esta propriedade corresponda ao que está no HTML
  isSidebarCollapsed = this.layoutService.sidebarCollapsed;
}
