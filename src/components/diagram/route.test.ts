import { describe, expect, it } from 'vitest'
import { anchor, midpoint, route, toPath } from './route'

const box = { x: 10, y: 20, w: 100, h: 40 }

describe('anchor', () => {
  it('posiciona no meio de cada lado', () => {
    expect(anchor(box, 'top')).toEqual({ x: 60, y: 20 })
    expect(anchor(box, 'right')).toEqual({ x: 110, y: 40 })
    expect(anchor(box, 'bottom')).toEqual({ x: 60, y: 60 })
    expect(anchor(box, 'left')).toEqual({ x: 10, y: 40 })
  })

  it('aplica o deslocamento ao longo do lado', () => {
    expect(anchor(box, 'left', -10)).toEqual({ x: 10, y: 30 })
    expect(anchor(box, 'bottom', 15)).toEqual({ x: 75, y: 60 })
  })
})

describe('route', () => {
  it('liga em linha reta quando os pontos estão alinhados', () => {
    expect(route({ x: 0, y: 0 }, 'bottom', { x: 0, y: 50 }, 'top')).toHaveLength(2)
  })

  it('faz um "Z" quando as duas pontas estão no mesmo eixo', () => {
    const points = route({ x: 0, y: 0 }, 'right', { x: 100, y: 60 }, 'left')
    expect(points).toEqual([
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 60 },
      { x: 100, y: 60 },
    ])
  })

  it('faz um "L" quando as pontas estão em eixos diferentes', () => {
    const points = route({ x: 0, y: 0 }, 'bottom', { x: 80, y: 40 }, 'left')
    expect(points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 40 },
      { x: 80, y: 40 },
    ])
  })

  it('só gera segmentos horizontais ou verticais', () => {
    const points = route({ x: 3, y: 7 }, 'top', { x: 90, y: -50 }, 'bottom')
    for (let i = 1; i < points.length; i++) {
      const horizontal = points[i].y === points[i - 1].y
      const vertical = points[i].x === points[i - 1].x
      expect(horizontal || vertical).toBe(true)
    }
  })
})

describe('toPath e midpoint', () => {
  it('gera o atributo d do SVG', () => {
    expect(toPath([{ x: 0, y: 0 }, { x: 10, y: 5 }])).toBe('M 0 0 L 10 5')
  })

  it('encontra o ponto na metade do comprimento total', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 0, y: 10 },
      { x: 30, y: 10 },
    ]
    expect(midpoint(points)).toEqual({ x: 10, y: 10 })
  })
})
