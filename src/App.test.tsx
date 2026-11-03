import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { NAV_LINKS } from './components/Nav'

afterEach(() => {
  document.documentElement.dataset.theme = 'dark'
})

describe('App', () => {
  it('mostra o nome e o papel no topo', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Bruno Nascimento Campos')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Desenvolvedor Full Stack')
  })

  it('cada link do menu leva a uma seção existente', () => {
    const { container } = render(<App />)
    for (const link of NAV_LINKS) {
      expect(container.querySelector(link.href)).not.toBeNull()
    }
  })

  it('renderiza os três estudos de caso com diagrama e código', () => {
    render(<App />)
    for (const title of ['Shopping List', 'EmpregAE', 'Syriana Dashboard']) {
      const article = screen.getByRole('article', { name: title })
      expect(within(article).getByText('Decisões técnicas')).toBeInTheDocument()
      expect(within(article).getByRole('img', { name: /arquitetura/i })).toBeInTheDocument()
      expect(within(article).getByRole('link', { name: /ver no github/i })).toBeInTheDocument()
    }
  })

  it('avisa que os dados da captura do projeto de cliente são ilustrativos', () => {
    render(<App />)
    const article = screen.getByRole('article', { name: 'Syriana Dashboard' })
    expect(within(article).getByRole('img', { name: /dados fictícios/i })).toBeInTheDocument()
    expect(within(article).getByText(/meramente ilustrativos/i)).toBeInTheDocument()
  })

  it('abre links externos em nova aba com rel seguro', () => {
    const { container } = render(<App />)
    const external = container.querySelectorAll('a[target="_blank"]')
    expect(external.length).toBeGreaterThan(0)
    external.forEach((a) => expect(a.getAttribute('rel')).toContain('noreferrer'))
  })

  it('alterna entre tema escuro e claro', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Usar tema claro' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    fireEvent.click(screen.getByRole('button', { name: 'Usar tema escuro' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('mostra um aviso quando o canvas não está disponível', () => {
    render(<App />)
    expect(screen.getByText('Simulação indisponível neste navegador.')).toBeInTheDocument()
  })
})
