import { downstreamConsumers, type Network, type NetworkEdge } from './network'

/**
 * Leituras simuladas e determinísticas: dado o mesmo instante `t` (segundos),
 * os valores são sempre os mesmos. Isso deixa a animação reproduzível e testável.
 */

export const PUMP_FLOW = 60 // L/min
export const TANK_CAPACITY = 10_000 // L
const CISTERN_CAPACITY = 20_000 // L

/** Consumo base de cada apartamento (L/min), por andar. */
const BASE_CONSUMPTION: Record<number, number> = { 4: 9, 3: 12, 2: 10, 1: 14 }
/** Andar com vazamento intermitente, para demonstrar a detecção de anomalias. */
export const ANOMALY_FLOOR = 2
const ANOMALY_FACTOR = 1.45

/** Ruído suave em [0, 1] a partir de senoides com frequências incomensuráveis. */
function smoothNoise(t: number, seed: number): number {
  const value =
    0.5 +
    0.28 * Math.sin(t * 0.55 + seed * 1.7) +
    0.16 * Math.sin(t * 1.31 + seed * 4.1) +
    0.06 * Math.sin(t * 2.9 + seed * 7.3)
  return Math.min(1, Math.max(0, value))
}

export function predictedConsumption(floor: number, t: number): number {
  const base = BASE_CONSUMPTION[floor] ?? 10
  return base * (0.55 + 0.45 * smoothNoise(t, floor))
}

export function isAnomalous(floor: number, t: number): boolean {
  return floor === ANOMALY_FLOOR && Math.sin(t * 0.21) > 0.55
}

export function consumption(floor: number, t: number): number {
  const predicted = predictedConsumption(floor, t)
  return isAnomalous(floor, t) ? predicted * ANOMALY_FACTOR : predicted
}

/** Quanto o consumo real está acima do previsto, em fração (0.45 = 45%). */
export function deviationFromPrediction(floor: number, t: number): number {
  return consumption(floor, t) / predictedConsumption(floor, t) - 1
}

/** Nível da caixa d'água em % — sobe enquanto a bomba está ligada. */
export function tankLevel(t: number): number {
  return 62 + 26 * Math.sin(t * 0.12)
}

export function cisternLevel(t: number): number {
  return 70 - 18 * Math.sin(t * 0.12)
}

/** A bomba fica ligada enquanto o nível da caixa está subindo. */
export function isPumpOn(t: number): boolean {
  return Math.cos(t * 0.12) > 0
}

export function tankVolume(t: number): number {
  return (tankLevel(t) / 100) * TANK_CAPACITY
}

export function cisternVolume(t: number): number {
  return (cisternLevel(t) / 100) * CISTERN_CAPACITY
}

/** Pressão estática no andar (bar): quanto mais baixo, maior a coluna d'água. */
export function pressure(floor: number, t: number): number {
  const heightBelowTank = (5 - floor) * 3 + 2 // metros
  const staticBar = heightBelowTank / 10.2
  const friction = 0.004 * consumption(floor, t)
  return Math.max(0, staticBar - friction)
}

/** Volume consumido "hoje" — integral aproximada da curva prevista mais um deslocamento fixo. */
export function dailyVolume(floor: number, t: number): number {
  const base = BASE_CONSUMPTION[floor] ?? 10
  return Math.round(base * 34 + (t % 600) * base * 0.08)
}

export function edgeFlow(network: Network, edge: NetworkEdge, t: number): number {
  if (edge.kind === 'supply') return isPumpOn(t) ? PUMP_FLOW : 0

  return downstreamConsumers(network, edge.id).reduce(
    (total, node) => total + consumption(node.floor ?? 0, t),
    0,
  )
}
