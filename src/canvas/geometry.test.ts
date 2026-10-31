import { describe, expect, it } from 'vitest'
import { distance, fitViewport, particlePositions, pointAlong, toScreen } from './geometry'

describe('fitViewport', () => {
  it('encaixa o mundo pela dimensão mais restritiva e centraliza', () => {
    const viewport = fitViewport(100, 50, 420, 420, 10)

    expect(viewport.scale).toBe(4) // largura útil 400 / 100
    expect(viewport.offsetX).toBe(10)
    expect(viewport.offsetY).toBe(110) // (420 - 50 * 4) / 2
  })

  it('converte coordenadas do mundo para a tela', () => {
    const viewport = { scale: 2, offsetX: 5, offsetY: 7 }
    expect(toScreen({ x: 10, y: 20 }, viewport)).toEqual({ x: 25, y: 47 })
  })
})

describe('pointAlong e distance', () => {
  it('interpola entre dois pontos', () => {
    expect(pointAlong({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5)).toEqual({ x: 5, y: 10 })
  })

  it('calcula a distância euclidiana', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
  })
})

describe('particlePositions', () => {
  it('distribui partículas igualmente espaçadas dentro do cano', () => {
    const positions = particlePositions(20, 0, 5)
    expect(positions).toEqual([0, 0.25, 0.5, 0.75])
  })

  it('desloca as partículas conforme o fluxo avança, sem sair do intervalo [0, 1)', () => {
    const positions = particlePositions(20, 7.5, 5)
    expect(positions[0]).toBeCloseTo(0.125)
    for (const p of positions) {
      expect(p).toBeGreaterThanOrEqual(0)
      expect(p).toBeLessThan(1)
    }
  })

  it('é periódico: avançar um espaçamento inteiro volta à mesma configuração', () => {
    expect(particlePositions(20, 3, 5)).toEqual(particlePositions(20, 8, 5))
  })

  it('não gera partículas em canos sem comprimento', () => {
    expect(particlePositions(0, 3, 5)).toEqual([])
  })
})
