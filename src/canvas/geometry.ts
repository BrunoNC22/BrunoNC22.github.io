export interface Point {
  x: number
  y: number
}

export interface Viewport {
  scale: number
  offsetX: number
  offsetY: number
}

/** Escala uniforme que encaixa o mundo lógico no canvas, centralizado, com margem. */
export function fitViewport(
  worldWidth: number,
  worldHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  padding: number,
): Viewport {
  const availableWidth = Math.max(1, canvasWidth - padding * 2)
  const availableHeight = Math.max(1, canvasHeight - padding * 2)
  const scale = Math.min(availableWidth / worldWidth, availableHeight / worldHeight)

  return {
    scale,
    offsetX: (canvasWidth - worldWidth * scale) / 2,
    offsetY: (canvasHeight - worldHeight * scale) / 2,
  }
}

export function toScreen(point: Point, viewport: Viewport): Point {
  return {
    x: viewport.offsetX + point.x * viewport.scale,
    y: viewport.offsetY + point.y * viewport.scale,
  }
}

/** Ponto a uma fração `t` (0..1) do segmento entre `a` e `b`. */
export function pointAlong(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

/**
 * Posições (0..1) das partículas ao longo de um cano. `travelled` é a distância
 * percorrida pelo fluxo até agora; `spacing` é a distância entre partículas.
 */
export function particlePositions(length: number, travelled: number, spacing: number): number[] {
  if (length <= 0 || spacing <= 0) return []

  const count = Math.max(1, Math.floor(length / spacing))
  const step = length / count
  const shift = ((travelled % step) + step) % step

  const positions: number[] = []
  for (let i = 0; i < count; i++) {
    positions.push((i * step + shift) / length)
  }
  return positions
}
