import { describe, expect, it } from 'vitest'
import { createBuildingNetwork, nodeById } from './network'
import { isInteractive, readNode } from './readings'
import { ANOMALY_FLOOR, isAnomalous, isPumpOn } from './simulation'

const network = createBuildingNetwork()
const instants = Array.from({ length: 200 }, (_, i) => i)

describe('readNode', () => {
  it('mostra nível e volume da caixa d’água', () => {
    const reading = readNode(nodeById(network, 'tank'), 10)
    expect(reading.title).toBe("Caixa d'água")
    expect(reading.rows.map(([label]) => label)).toEqual(['Nível', 'Volume'])
    expect(reading.rows[0][1]).toMatch(/^\d+%$/)
  })

  it('reflete o estado da bomba', () => {
    const on = instants.find((t) => isPumpOn(t))!
    const off = instants.find((t) => !isPumpOn(t))!
    expect(readNode(nodeById(network, 'pump'), on).statusLabel).toBe('Ligada')
    expect(readNode(nodeById(network, 'pump'), off)).toMatchObject({ status: 'idle', statusLabel: 'Desligada' })
  })

  it('sinaliza a anomalia no hidrômetro com o desvio em relação ao previsto', () => {
    const t = instants.find((i) => isAnomalous(ANOMALY_FLOOR, i))!
    const reading = readNode(nodeById(network, `sensor-${ANOMALY_FLOOR}`), t)
    expect(reading.status).toBe('alert')
    expect(reading.statusLabel).toMatch(/Anomalia: 45\s?% acima do previsto/)
  })

  it('formata números no padrão brasileiro', () => {
    const reading = readNode(nodeById(network, 'sensor-3'), 12)
    const flow = reading.rows.find(([label]) => label === 'Vazão')![1]
    expect(flow).toMatch(/^\d+,\d L\/min$/)
  })

  it('só os componentes físicos são interativos (conexões não)', () => {
    expect(isInteractive(nodeById(network, 'header'))).toBe(false)
    expect(isInteractive(nodeById(network, 'sensor-1'))).toBe(true)
  })
})
