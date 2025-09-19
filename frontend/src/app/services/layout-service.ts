import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  // Usamos um signal para controlar o estado do sidebar (recolhido/expandido)
  // Ele é reativo e qualquer componente que o usar será atualizado automaticamente.
  sidebarCollapsed = signal(false);

  // Método para inverter o estado
  toggleSidebar() {
    this.sidebarCollapsed.update((value) => !value);
  }
}
