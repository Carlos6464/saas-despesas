import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// Definição do Preset Customizado adaptado para a paleta de cores do projeto DIAMOND
export const ThemePresetCustomizado = definePreset(Aura, {
  semantic: {
    // --- CORES PRIMÁRIAS ---
    // Mantém a paleta azul que já estava definida, pois é a cor de destaque principal.
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Cor principal do seu projeto (Azul)
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },

    // --- ESQUEMA DE CORES (LIGHT & DARK) ---
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}', // Fundo do botão primário
          inverseColor: '#ffffff', // Texto do botão primário
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        highlight: {
          background: '{primary.500}', // Fundo de itens selecionados/focados
          color: '#ffffff',
        },
        // --- CORES DE SUPERFÍCIE (FUNDOS) - MODO CLARO ---
        surface: {
          page: '#F0F5F8', // Cor de fundo da PÁGINA (Fundo Secundário/Ilustração da sua imagem)
          card: '#FFFFFF', // Cor de fundo de CARDS e componentes (Fundo Claro da sua imagem)
          hover: '#f0f5f8', // Cor ao passar o rato por cima de itens
          border: '#D1D5DB', // Cor das BORDAS e separadores
        },
        // --- CORES DE TEXTO - MODO CLARO ---
        text: {
          color: '#333333', // Cor do TEXTO PRINCIPAL (Texto Escuro da sua imagem)
          secondaryColor: '#666666', // Cor do TEXTO SECUNDÁRIO (Texto Neutro da sua imagem)
        },
      },
      dark: {
        primary: {
          color: '{primary.500}',
          inverseColor: '#ffffff',
          hoverColor: '{primary.400}',
          activeColor: '{primary.300}',
        },
        highlight: {
          background: 'rgba(96, 165, 250, 0.16)',
          color: '{primary.100}',
        },
        // --- CORES DE SUPERFÍCIE (FUNDOS) - MODO ESCURO ---
        surface: {
          page: '#1A1A1A', // Cor de fundo da PÁGINA (Fundo Escuro da sua imagem)
          card: '#2C2C2C', // Cor de fundo de CARDS e componentes (Fundo Secundário/Ilustração da sua imagem)
          hover: '#4A4A4A', // Cor ao passar o rato por cima de itens
          border: '#4A4A4A', // Cor das BORDAS e separadores
        },
        // --- CORES DE TEXTO - MODO ESCURO ---
        text: {
          color: '#E0E0E0', // Cor do TEXTO PRINCIPAL (Texto Claro da sua imagem)
          secondaryColor: '#A0A0A0', // Cor do TEXTO SECUNDÁRIO (Texto Neutro Dark da sua imagem)
        },
      },
    },
  },

  // --- DEFINIÇÕES DE LAYOUT (mantidas para consistência) ---
  layout: {
    borderRadius: '8px',
    shadow: {
      card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    },
  },

  // --- DEFINIÇÕES DE TIPOGRAFIA (mantidas para consistência) ---
  typography: {
    fontFamily: "'Inter', sans-serif", // Sugestão de uma fonte moderna
  },

  // --- ESTILOS ESPECÍFICOS POR COMPONENTE ---
  components: {
    card: {
      colorScheme: {
        light: {
          root: {
            background: '{surface.card}', // Usa a cor de fundo de card definida para o modo claro
            color: '{text.color}', // Usa a cor de texto principal definida para o modo claro
          },
          subtitle: {
            color: '{text.secondaryColor}', // Usa a cor de texto secundária
          },
        },
        dark: {
          root: {
            background: '{surface.card}', // Usa a cor de fundo de card definida para o modo escuro
            color: '{text.color}', // Usa a cor de texto principal definida para o modo escuro
          },
          subtitle: {
            color: '{text.secondaryColor}', // Usa a cor de texto secundária
          },
        },
      },
    },
  },
});
