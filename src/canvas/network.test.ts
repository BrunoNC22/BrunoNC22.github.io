import { describe, expect, it } from 'vitest'
import { FLOORS, createBuildingNetwork, downstreamConsumers, nodeById } from './network'

describe('createBuildingNetwork', () => {
  const network = createBuildingNetwork()

  it('cria um hidrômetro e um apartamento por andar', () => {
    const sensors = network.nodes.filter((n) => n.kind === 'sensor')
    const consumers = network.nodes.filter((n) => n.kind === 'consumer')

    expect(sensors.map((n) => n.floor)).toEqual([...FLOORS])
    expect(consumers.map((n) => n.floor)).toEqual([...FLOORS])
  })

  it('só tem arestas entre nós existentes e com ids únicos', () => {
    const ids = new Set(network.edges.map((e) => e.id))
    expect(ids.size).toBe(network.edges.length)

    for (const edge of network.edges) {
      expect(() => nodeById(network, edge.from)).not.toThrow()
      expect(() => nodeById(network, edge.to)).not.toThrow()
    }
  })

  it('mantém todos os nós dentro do mundo lógico', () => {
    for (const node of network.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0)
      expect(node.x).toBeLessThanOrEqual(118)
      expect(node.y).toBeGreaterThanOrEqual(0)
      expect(node.y).toBeLessThanOrEqual(104)
    }
  })
})

describe('downstreamConsumers', () => {
  const network = createBuildingNetwork()

  it('a saída da caixa alimenta todos os apartamentos', () => {
    expect(downstreamConsumers(network, 'tank-header')).toHaveLength(FLOORS.length)
  })

  it('cada trecho da coluna alimenta apenas os andares abaixo dele', () => {
    const fed = downstreamConsumers(network, 'riser-4-riser-3').map((n) => n.floor).sort()
    expect(fed).toEqual([1, 2, 3])
  })

  it('um ramal alimenta apenas o seu apartamento', () => {
    expect(downstreamConsumers(network, 'sensor-2-apt-2').map((n) => n.id)).toEqual(['apt-2'])
  })

  it('o recalque não leva a consumidores (a caixa interrompe o caminho)', () => {
    expect(downstreamConsumers(network, 'cistern-pump')).toEqual([])
  })

  it('falha com aresta inexistente', () => {
    expect(() => downstreamConsumers(network, 'nao-existe')).toThrow()
  })
})
