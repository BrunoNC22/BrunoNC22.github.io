import type { NetworkNode } from './network'
import {
  PUMP_FLOW,
  TANK_CAPACITY,
  cisternLevel,
  cisternVolume,
  consumption,
  dailyVolume,
  deviationFromPrediction,
  isAnomalous,
  isPumpOn,
  pressure,
  tankLevel,
  tankVolume,
} from './simulation'

export type ReadingStatus = 'ok' | 'alert' | 'idle'

export interface NodeReading {
  title: string
  status: ReadingStatus
  statusLabel: string
  rows: Array<[label: string, value: string]>
}

const decimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const integer = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })
const percent = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 0 })

export function isInteractive(node: NetworkNode): boolean {
  return node.kind !== 'junction'
}

/** Texto do painel que aparece ao passar o mouse (ou focar) em um componente. */
export function readNode(node: NetworkNode, t: number): NodeReading {
  switch (node.kind) {
    case 'tank':
      return {
        title: node.label,
        status: 'ok',
        statusLabel: isPumpOn(t) ? 'Enchendo' : 'Abastecendo o prédio',
        rows: [
          ['Nível', `${integer.format(tankLevel(t))}%`],
          ['Volume', `${integer.format(tankVolume(t))} L de ${integer.format(TANK_CAPACITY)} L`],
        ],
      }

    case 'cistern':
      return {
        title: node.label,
        status: 'ok',
        statusLabel: 'Reservatório inferior',
        rows: [
          ['Nível', `${integer.format(cisternLevel(t))}%`],
          ['Volume', `${integer.format(cisternVolume(t))} L`],
        ],
      }

    case 'pump': {
      const on = isPumpOn(t)
      return {
        title: node.label,
        status: on ? 'ok' : 'idle',
        statusLabel: on ? 'Ligada' : 'Desligada',
        rows: [['Vazão', on ? `${integer.format(PUMP_FLOW)} L/min` : '0 L/min']],
      }
    }

    case 'sensor': {
      const floor = node.floor ?? 0
      const anomalous = isAnomalous(floor, t)
      return {
        title: node.label,
        status: anomalous ? 'alert' : 'ok',
        statusLabel: anomalous
          ? `Anomalia: ${percent.format(deviationFromPrediction(floor, t))} acima do previsto`
          : 'Consumo dentro do previsto',
        rows: [
          ['Vazão', `${decimal.format(consumption(floor, t))} L/min`],
          ['Pressão', `${decimal.format(pressure(floor, t))} bar`],
          ['Hoje', `${integer.format(dailyVolume(floor, t))} L`],
        ],
      }
    }

    case 'consumer': {
      const floor = node.floor ?? 0
      return {
        title: node.label,
        status: isAnomalous(floor, t) ? 'alert' : 'ok',
        statusLabel: isAnomalous(floor, t) ? 'Possível vazamento' : 'Uso normal',
        rows: [['Consumo agora', `${decimal.format(consumption(floor, t))} L/min`]],
      }
    }

    case 'junction':
      return { title: node.label, status: 'idle', statusLabel: 'Conexão', rows: [] }
  }
}
