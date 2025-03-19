
import { useEffect, useState } from 'react';

type ThemeState = 'light' | 'dark';

export function useCurrentTheme(): ThemeState {
  const [theme, setTheme] = useState<ThemeState>(() => {
    // Verificar se o tema está definido na raiz do documento
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? 'dark' : 'light';
  });

  useEffect(() => {
    // Função para determinar o tema atual
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    // Observar mudanças nas classes do elemento HTML para detectar alterações de tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Verificar se há uma preferência do sistema para tema escuro
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Função para atualizar o tema com base na mudança da preferência do sistema
    const handleMediaChange = () => {
      updateTheme();
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return theme;
}
