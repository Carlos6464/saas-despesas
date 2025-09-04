
import { Component, signal, Renderer2, PLATFORM_ID, Inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [ButtonModule,CardModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
   private themeKey = 'theme-preference';
  isDarkMode = false; 

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    //-- A verificação continua aqui, perfeita!
    if (isPlatformBrowser(this.platformId)) {
      this.loadTheme();
    }
  }

  // Esta função deve ler o storage e definir o estado inicial.
  loadTheme() {
    const savedTheme: string | null = localStorage.getItem(this.themeKey);
    this.isDarkMode = savedTheme === 'dark'; // Define o estado inicial corretamente

    const htmlElement = document.documentElement;
    if (this.isDarkMode) {
      this.renderer.addClass(htmlElement, 'my-app-dark');
    } else {
      this.renderer.removeClass(htmlElement, 'my-app-dark');
    }
  }

  //-- Esta função deve apenas inverter o estado atual e salvar. 
  toggleDarkMode() {
    //-- Inverte o estado atual da variável
    this.isDarkMode = !this.isDarkMode;

    //-- Aplica a mudança visual
    const htmlElement = document.documentElement;
    if (this.isDarkMode) {
      this.renderer.addClass(htmlElement, 'my-app-dark');
      //-- Salva o novo estado no storage
      localStorage.setItem(this.themeKey, 'dark');
    } else {
      this.renderer.removeClass(htmlElement, 'my-app-dark');
      //-- Salva o novo estado no storage
      localStorage.setItem(this.themeKey, 'light');
    }
  }
}
