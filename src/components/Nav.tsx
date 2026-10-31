import { useEffect, useState } from 'react'
import { applyTheme, currentTheme, type Theme } from '../lib/theme'
import { Icon } from './ui/Icon'
import './nav.css'

export const NAV_LINKS = [
  { href: '#trajetoria', label: 'Trajetória' },
  { href: '#estudos', label: 'Estudos de caso' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#profissional', label: 'Profissional' },
  { href: '#formacao', label: 'Formação' },
]

export function Nav() {
  const [theme, setTheme] = useState<Theme>(() => currentTheme())
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`} aria-label="Navegação principal">
      <div className="container nav__inner">
        <a className="nav__brand" href="#topo">
          <span className="nav__mark" aria-hidden="true">
            BN
          </span>
          <span>Bruno Nascimento</span>
        </a>

        <ul className="nav__links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="nav__theme"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
          title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
      </div>
    </nav>
  )
}
