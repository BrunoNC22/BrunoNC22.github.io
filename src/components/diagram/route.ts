export type Side = 'top' | 'right' | 'bottom' | 'left'

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface Point {
  x: number
  y: number
}

/** Ponto no meio de um lado do retângulo, deslocado `offset` ao longo desse lado. */
export function anchor(rect: Rect, side: Side, offset = 0): Point {
  switch (side) {
    case 'top':
      return { x: rect.x + rect.w / 2 + offset, y: rect.y }
    case 'bottom':
      return { x: rect.x + rect.w / 2 + offset, y: rect.y + rect.h }
    case 'left':
      return { x: rect.x, y: rect.y + rect.h / 2 + offset }
    case 'right':
      return { x: rect.x + rect.w, y: rect.y + rect.h / 2 + offset }
  }
}

const isVertical = (side: Side) => side === 'top' || side === 'bottom'

/**
 * Rota ortogonal entre dois pontos de ancoragem.
 * Mesmo eixo nas duas pontas → caminho em "Z" com dobra no meio; eixos diferentes → um "L".
 */
export function route(start: Point, startSide: Side, end: Point, endSide: Side): Point[] {
  if (start.x === end.x || start.y === end.y) return [start, end]

  if (isVertical(startSide) && isVertical(endSide)) {
    const midY = (start.y + end.y) / 2
    return [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end]
  }

  if (!isVertical(startSide) && !isVertical(endSide)) {
    const midX = (start.x + end.x) / 2
    return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end]
  }

  const corner = isVertical(startSide) ? { x: start.x, y: end.y } : { x: end.x, y: start.y }
  return [start, corner, end]
}

export function toPath(points: Point[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

/** Ponto no meio do comprimento total do caminho — onde o rótulo da seta é posicionado. */
export function midpoint(points: Point[]): Point {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y))
  let remaining = lengths.reduce((a, b) => a + b, 0) / 2

  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const t = lengths[i] === 0 ? 0 : remaining / lengths[i]
      const a = points[i]
      const b = points[i + 1]
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    }
    remaining -= lengths[i]
  }
  return points[points.length - 1]
}
