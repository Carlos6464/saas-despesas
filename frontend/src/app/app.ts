import {
  Component,
  Renderer2,
  PLATFORM_ID,
  Inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

// Imports dos componentes PrimeNG para o botão flutuante
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true, // Adiciona a propriedade standalone
  imports: [RouterOutlet, ButtonModule, RippleModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private themeKey = 'theme-preference';
  isDarkMode = false;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    // Garante que o código que manipula o 'localStorage' só rode no navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadTheme();
    }
  }

  loadTheme() {
    const savedTheme: string | null = localStorage.getItem(this.themeKey);
    this.isDarkMode = savedTheme === 'dark';
    this.updateThemeClass();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem(this.themeKey, this.isDarkMode ? 'dark' : 'light');
    this.updateThemeClass();
  }

  private updateThemeClass() {
    const htmlElement = document.documentElement;
    if (this.isDarkMode) {
      this.renderer.addClass(htmlElement, 'my-app-dark');
    } else {
      this.renderer.removeClass(htmlElement, 'my-app-dark');
    }
  }
}
