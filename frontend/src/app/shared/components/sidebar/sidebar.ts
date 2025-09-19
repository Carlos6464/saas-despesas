import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { LayoutService } from '../../../services/layout-service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgClass, TooltipModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private layoutService = inject(LayoutService);
  isCollapsed = this.layoutService.sidebarCollapsed;

  items = [
    { label: 'Dashboard', icon: 'pi pi-home', link: ['/app/dashboard'] },
    { label: 'Categorias', icon: 'pi pi-tags', link: ['/app/categorias'] },
    { label: 'Despesas', icon: 'pi pi-dollar', link: ['/app/despesas'] },
  ];
}
