export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f6f3' : '#0a0e13')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Armazenamento indisponível (aba anônima, bloqueio): o tema vale só para esta visita.
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
