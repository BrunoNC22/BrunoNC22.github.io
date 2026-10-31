import { describe, expect, it } from 'vitest'
import { FLOORS, createBuildingNetwork } from './network'
import {
  ANOMALY_FLOOR,
  PUMP_FLOW,
  consumption,
  deviationFromPrediction,
  edgeFlow,
  isAnomalous,
  isPumpOn,
  predictedConsumption,
  pressure,
  tankLevel,
} from './simulation'

const SAMPLES = Array.from({ length: 400 }, (_, i) => i * 0.75)

describe('simulação', () => {
  it('é determinística: o mesmo instante gera a mesma leitura', () => {
    expect(consumption(3, 42.5)).toBe(consumption(3, 42.5))
    expect(tankLevel(42.5)).toBe(tankLevel(42.5))
  })

  it('mantém níveis entre 0% e 100% e consumo positivo', () => {
    for (const t of SAMPLES) {
      expect(tankLevel(t)).toBeGreaterThan(0)
      expect(tankLevel(t)).toBeLessThan(100)
      for (const floor of FLOORS) expect(consumption(floor, t)).toBeGreaterThan(0)
    }
  })

  it('liga a bomba exatamente quando o nível da caixa está subindo', () => {
    for (const t of SAMPLES) {
      const rising = tankLevel(t + 0.01) > tankLevel(t)
      expect(isPumpOn(t)).toBe(rising)
    }
  })

  it('só gera anomalia no andar configurado e, quando gera, o consumo fica acima do previsto', () => {
    const anomalousInstants = SAMPLES.filter((t) => isAnomalous(ANOMALY_FLOOR, t))
    expect(anomalousInstants.length).toBeGreaterThan(0)

    for (const t of anomalousInstants) {
      expect(deviationFromPrediction(ANOMALY_FLOOR, t)).toBeCloseTo(0.45)
    }
    for (const floor of FLOORS.filter((f) => f !== ANOMALY_FLOOR)) {
      expect(SAMPLES.some((t) => isAnomalous(floor, t))).toBe(false)
      expect(consumption(floor, 10)).toBe(predictedConsumption(floor, 10))
    }
  })

  it('a pressão aumenta nos andares mais baixos', () => {
    expect(pressure(1, 0)).toBeGreaterThan(pressure(4, 0))
  })
})

describe('edgeFlow', () => {
  const network = createBuildingNetwork()
  const edge = (id: string) => network.edges.find((e) => e.id === id)!

  it('conserva a vazão: a saída da caixa é a soma dos ramais', () => {
    for (const t of SAMPLES.slice(0, 50)) {
      const total = edgeFlow(network, edge('tank-header'), t)
      const branches = FLOORS.reduce((sum, floor) => sum + edgeFlow(network, edge(`sensor-${floor}-apt-${floor}`), t), 0)
      expect(total).toBeCloseTo(branches)
    }
  })

  it('a vazão na coluna diminui a cada andar alimentado', () => {
    const t = 30
    const top = edgeFlow(network, edge('header-riser-4'), t)
    const middle = edgeFlow(network, edge('riser-4-riser-3'), t)
    const bottom = edgeFlow(network, edge('riser-2-riser-1'), t)
    expect(top).toBeGreaterThan(middle)
    expect(middle).toBeGreaterThan(bottom)
  })

  it('o recalque tem vazão da bomba quando ligada e zero quando desligada', () => {
    const on = SAMPLES.find((t) => isPumpOn(t))!
    const off = SAMPLES.find((t) => !isPumpOn(t))!
    expect(edgeFlow(network, edge('pump-tank'), on)).toBe(PUMP_FLOW)
    expect(edgeFlow(network, edge('pump-tank'), off)).toBe(0)
  })
})
