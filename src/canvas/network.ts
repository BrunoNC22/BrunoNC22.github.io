/**
 * Topologia de uma instalação hidráulica predial, desenhada como grafo.
 *
 * Coordenadas em um espaço lógico de WORLD_WIDTH x WORLD_HEIGHT; o renderer
 * escala para o tamanho real do canvas. O desenho segue um corte de prédio:
 * cisterna e bomba no térreo, caixa d'água no topo e uma coluna de
 * distribuição que desce alimentando um hidrômetro por andar.
 */

export const WORLD_WIDTH = 118
export const WORLD_HEIGHT = 104

export type NodeKind = 'cistern' | 'pump' | 'tank' | 'junction' | 'sensor' | 'consumer'

export interface NetworkNode {
  id: string
  kind: NodeKind
  x: number
  y: number
  label: string
  /** Índice do andar (0 = térreo) para sensores e consumidores. */
  floor?: number
}

export type EdgeKind = 'supply' | 'distribution'

export interface NetworkEdge {
  id: string
  from: string
  to: string
  /** supply: recalque (cisterna → caixa); distribution: gravidade (caixa → aptos). */
  kind: EdgeKind
}

export interface Network {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
}

export const FLOORS = [4, 3, 2, 1] as const
const RISER_X = 60
const SENSOR_X = 80
const CONSUMER_X = 103
const FIRST_FLOOR_Y = 30
const FLOOR_GAP = 16

export function floorY(floor: number): number {
  return FIRST_FLOOR_Y + (FLOORS[0] - floor) * FLOOR_GAP
}

export function createBuildingNetwork(): Network {
  const nodes: NetworkNode[] = [
    { id: 'cistern', kind: 'cistern', x: 11, y: 92, label: 'Cisterna' },
    { id: 'pump', kind: 'pump', x: 30, y: 92, label: 'Bomba' },
    { id: 'tank', kind: 'tank', x: 30, y: 12, label: "Caixa d'água" },
    { id: 'header', kind: 'junction', x: RISER_X, y: 12, label: 'Barrilete' },
  ]

  const edges: NetworkEdge[] = [
    { id: 'cistern-pump', from: 'cistern', to: 'pump', kind: 'supply' },
    { id: 'pump-tank', from: 'pump', to: 'tank', kind: 'supply' },
    { id: 'tank-header', from: 'tank', to: 'header', kind: 'distribution' },
  ]

  let previous = 'header'
  for (const floor of FLOORS) {
    const y = floorY(floor)
    const junction = `riser-${floor}`
    const sensor = `sensor-${floor}`
    const consumer = `apt-${floor}`

    nodes.push(
      { id: junction, kind: 'junction', x: RISER_X, y, label: `${floor}º andar` },
      { id: sensor, kind: 'sensor', x: SENSOR_X, y, label: `Hidrômetro ${floor}01`, floor },
      { id: consumer, kind: 'consumer', x: CONSUMER_X, y, label: `Apto ${floor}01`, floor },
    )
    edges.push(
      { id: `${previous}-${junction}`, from: previous, to: junction, kind: 'distribution' },
      { id: `${junction}-${sensor}`, from: junction, to: sensor, kind: 'distribution' },
      { id: `${sensor}-${consumer}`, from: sensor, to: consumer, kind: 'distribution' },
    )
    previous = junction
  }

  return { nodes, edges }
}

export function nodeById(network: Network, id: string): NetworkNode {
  const node = network.nodes.find((n) => n.id === id)
  if (!node) throw new Error(`Nó inexistente: ${id}`)
  return node
}

/** Consumidores alimentados por uma aresta (todos os que estão a jusante dela). */
export function downstreamConsumers(network: Network, edgeId: string): NetworkNode[] {
  const edge = network.edges.find((e) => e.id === edgeId)
  if (!edge) throw new Error(`Aresta inexistente: ${edgeId}`)

  const result: NetworkNode[] = []
  const visited = new Set<string>()
  const stack = [edge.to]

  while (stack.length > 0) {
    const id = stack.pop()!
    if (visited.has(id)) continue
    visited.add(id)

    const node = nodeById(network, id)
    if (node.kind === 'consumer') result.push(node)

    for (const next of network.edges) {
      if (next.from === id && next.kind === 'distribution') stack.push(next.to)
    }
  }

  return result
}
