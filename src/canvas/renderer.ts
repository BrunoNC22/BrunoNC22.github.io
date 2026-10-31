import { FLOORS, WORLD_HEIGHT, WORLD_WIDTH, floorY, nodeById, type Network, type NetworkNode } from './network'
import { cisternLevel, edgeFlow, isAnomalous, isPumpOn, tankLevel } from './simulation'
import { distance, fitViewport, particlePositions, toScreen, type Point, type Viewport } from './geometry'

export interface Palette {
  grid: string
  slab: string
  pipe: string
  pipeCore: string
  water: string
  particle: string
  surface: string
  stroke: string
  text: string
  muted: string
  ok: string
  alert: string
  highlight: string
}

export interface NodePosition {
  node: NetworkNode
  x: number
  y: number
}

interface RendererOptions {
  palette: Palette
  reducedMotion: boolean
  /** Instante inicial da simulação (s); escolhido para a primeira imagem já ter movimento. */
  startTime?: number
}

const PADDING = 14
const PARTICLE_SPACING = 4.2 // unidades do mundo
const REFERENCE_FLOW = 45 // L/min que corresponde à velocidade "normal" das partículas
const GROUND_Y = floorY(1) + 8
const ROOF_Y = floorY(FLOORS[0]) - 8

/**
 * Desenha a rede hidráulica em um <canvas> 2D e anima o fluxo de água.
 * Não depende de React: o componente apenas cria, redimensiona e destrói.
 */
export class WaterNetworkRenderer {
  private readonly ctx: CanvasRenderingContext2D
  private viewport: Viewport = { scale: 1, offsetX: 0, offsetY: 0 }
  private width = 0
  private height = 0
  private simTime: number
  private lastTimestamp: number | null = null
  private frameId: number | null = null
  private highlighted: string | null = null
  private readonly travelled = new Map<string, number>()
  private readonly canvas: HTMLCanvasElement
  private readonly network: Network
  private palette: Palette
  private readonly reducedMotion: boolean

  constructor(canvas: HTMLCanvasElement, network: Network, options: RendererOptions) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D indisponível')

    this.ctx = ctx
    this.canvas = canvas
    this.network = network
    this.palette = options.palette
    this.reducedMotion = options.reducedMotion
    this.simTime = options.startTime ?? 24
  }

  get time(): number {
    return this.simTime
  }

  get isRunning(): boolean {
    return this.frameId !== null
  }

  resize(width: number, height: number): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.width = width
    this.height = height
    this.canvas.width = Math.round(width * dpr)
    this.canvas.height = Math.round(height * dpr)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.viewport = fitViewport(WORLD_WIDTH, WORLD_HEIGHT, width, height, PADDING)
    this.draw()
  }

  nodePositions(): NodePosition[] {
    return this.network.nodes.map((node) => ({ node, ...toScreen(node, this.viewport) }))
  }

  setHighlighted(id: string | null): void {
    this.highlighted = id
    if (!this.isRunning) this.draw()
  }

  setPalette(palette: Palette): void {
    this.palette = palette
    this.draw()
  }

  start(): void {
    if (this.reducedMotion || this.isRunning) {
      this.draw()
      return
    }
    this.lastTimestamp = null
    this.frameId = requestAnimationFrame(this.tick)
  }

  stop(): void {
    if (this.frameId !== null) cancelAnimationFrame(this.frameId)
    this.frameId = null
  }

  private readonly tick = (timestamp: number): void => {
    const dt = this.lastTimestamp === null ? 0 : Math.min(0.05, (timestamp - this.lastTimestamp) / 1000)
    this.lastTimestamp = timestamp
    this.simTime += dt

    for (const edge of this.network.edges) {
      const flow = edgeFlow(this.network, edge, this.simTime)
      if (flow <= 0.5) continue
      const speed = 3 + 13 * (flow / REFERENCE_FLOW)
      this.travelled.set(edge.id, (this.travelled.get(edge.id) ?? 0) + speed * dt)
    }

    this.draw()
    this.frameId = requestAnimationFrame(this.tick)
  }

  /* ------------------------------------------------------------------ */

  private draw(): void {
    const { ctx } = this
    ctx.clearRect(0, 0, this.width, this.height)
    if (this.width === 0 || this.height === 0) return

    this.drawGrid()
    this.drawBuilding()
    this.drawPipes()
    this.drawParticles()
    for (const node of this.network.nodes) this.drawNode(node)
  }

  private s(value: number): number {
    return value * this.viewport.scale
  }

  private screen(point: Point): Point {
    return toScreen(point, this.viewport)
  }

  private font(size: number, weight = 500): string {
    const px = Math.max(9, Math.min(12, this.s(size)))
    return `${weight} ${px}px "JetBrains Mono", ui-monospace, monospace`
  }

  private drawGrid(): void {
    const { ctx } = this
    const step = this.s(4)
    if (step < 6) return

    ctx.fillStyle = this.palette.grid
    for (let x = this.viewport.offsetX % step; x < this.width; x += step) {
      for (let y = this.viewport.offsetY % step; y < this.height; y += step) {
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }

  private drawBuilding(): void {
    const { ctx } = this
    ctx.save()
    ctx.strokeStyle = this.palette.slab
    ctx.lineWidth = 1
    ctx.setLineDash([this.s(1.2), this.s(1.2)])

    const slab = (y: number, x1: number, x2: number) => {
      const a = this.screen({ x: x1, y })
      const b = this.screen({ x: x2, y })
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }

    slab(ROOF_Y, 20, 114)
    for (const floor of FLOORS) slab(floorY(floor) + 8, 44, 114)

    ctx.setLineDash([])
    ctx.lineWidth = 1.5
    slab(GROUND_Y, 2, 116)

    ctx.fillStyle = this.palette.muted
    ctx.font = this.font(2.6)
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (const floor of FLOORS) {
      const p = this.screen({ x: 54, y: floorY(floor) + 4 })
      ctx.fillText(`${floor}º`, p.x, p.y)
    }
    const ground = this.screen({ x: 115, y: GROUND_Y + 3 })
    ctx.fillText('nível da rua', ground.x, ground.y)
    ctx.restore()
  }

  private drawPipes(): void {
    const { ctx } = this
    ctx.save()
    ctx.lineCap = 'round'

    for (const edge of this.network.edges) {
      const a = this.screen(nodeById(this.network, edge.from))
      const b = this.screen(nodeById(this.network, edge.to))

      ctx.strokeStyle = this.palette.pipe
      ctx.lineWidth = Math.max(4, this.s(1.6))
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()

      const flowing = edgeFlow(this.network, edge, this.simTime) > 0.5
      ctx.strokeStyle = flowing ? this.palette.water : this.palette.pipeCore
      ctx.globalAlpha = flowing ? 0.35 : 1
      ctx.lineWidth = Math.max(1.5, this.s(0.6))
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
      ctx.globalAlpha = 1
    }
    ctx.restore()
  }

  private drawParticles(): void {
    const { ctx } = this
    const radius = Math.max(1.4, this.s(0.42))

    for (const edge of this.network.edges) {
      if (edgeFlow(this.network, edge, this.simTime) <= 0.5) continue

      const from = nodeById(this.network, edge.from)
      const to = nodeById(this.network, edge.to)
      const length = distance(from, to)
      const positions = particlePositions(length, this.travelled.get(edge.id) ?? 0, PARTICLE_SPACING)

      for (const t of positions) {
        const p = this.screen({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t })
        ctx.fillStyle = this.palette.particle
        ctx.globalAlpha = 0.22
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 2.4, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  private drawNode(node: NetworkNode): void {
    switch (node.kind) {
      case 'tank':
        this.drawReservoir(node, 18, 12, tankLevel(this.simTime))
        this.drawLabel(node.label, node.x, node.y - 9)
        break
      case 'cistern':
        this.drawReservoir(node, 16, 9, cisternLevel(this.simTime))
        this.drawLabel(node.label, node.x, node.y + 8.6)
        break
      case 'pump':
        this.drawPump(node)
        this.drawLabel(node.label, node.x, node.y + 8.6)
        break
      case 'sensor':
        this.drawSensor(node)
        break
      case 'consumer':
        this.drawConsumer(node)
        break
      case 'junction': {
        const p = this.screen(node)
        this.ctx.fillStyle = this.palette.pipe
        this.ctx.beginPath()
        this.ctx.arc(p.x, p.y, Math.max(2.5, this.s(1.2)), 0, Math.PI * 2)
        this.ctx.fill()
        break
      }
    }

    if (this.highlighted === node.id) this.drawHighlight(node)
  }

  private drawLabel(text: string, x: number, y: number): void {
    const { ctx } = this
    const p = this.screen({ x, y })
    ctx.fillStyle = this.palette.muted
    ctx.font = this.font(2.6)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, p.x, p.y)
  }

  private roundedRect(x: number, y: number, w: number, h: number, r: number): void {
    const { ctx } = this
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, r)
  }

  private drawReservoir(node: NetworkNode, w: number, h: number, levelPercent: number): void {
    const { ctx } = this
    const topLeft = this.screen({ x: node.x - w / 2, y: node.y - h / 2 })
    const width = this.s(w)
    const height = this.s(h)
    const radius = this.s(1.4)

    this.roundedRect(topLeft.x, topLeft.y, width, height, radius)
    ctx.fillStyle = this.palette.surface
    ctx.fill()

    ctx.save()
    this.roundedRect(topLeft.x, topLeft.y, width, height, radius)
    ctx.clip()
    const waterTop = topLeft.y + height * (1 - levelPercent / 100)
    const wave = this.reducedMotion ? 0 : this.s(0.35)
    ctx.fillStyle = this.palette.water
    ctx.globalAlpha = 0.55
    ctx.beginPath()
    ctx.moveTo(topLeft.x, topLeft.y + height)
    for (let i = 0; i <= 24; i++) {
      const x = topLeft.x + (width * i) / 24
      const y = waterTop + Math.sin(i / 3 + this.simTime * 2) * wave
      ctx.lineTo(x, y)
    }
    ctx.lineTo(topLeft.x + width, topLeft.y + height)
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    this.roundedRect(topLeft.x, topLeft.y, width, height, radius)
    ctx.strokeStyle = this.palette.stroke
    ctx.lineWidth = 1.5
    ctx.stroke()

    const center = this.screen(node)
    ctx.fillStyle = this.palette.text
    ctx.font = this.font(2.8, 600)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.round(levelPercent)}%`, center.x, center.y)
  }

  private drawPump(node: NetworkNode): void {
    const { ctx } = this
    const on = isPumpOn(this.simTime)
    const p = this.screen(node)
    const r = this.s(3.6)

    ctx.beginPath()
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
    ctx.fillStyle = this.palette.surface
    ctx.fill()
    ctx.strokeStyle = on ? this.palette.water : this.palette.stroke
    ctx.lineWidth = 1.5
    ctx.stroke()

    const angle = on && !this.reducedMotion ? this.simTime * 5 : 0
    ctx.strokeStyle = on ? this.palette.water : this.palette.muted
    ctx.lineWidth = Math.max(1.2, this.s(0.5))
    ctx.lineCap = 'round'
    for (let i = 0; i < 3; i++) {
      const a = angle + (i * Math.PI * 2) / 3
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(p.x + Math.cos(a) * r * 0.62, p.y + Math.sin(a) * r * 0.62)
      ctx.stroke()
    }
  }

  private drawSensor(node: NetworkNode): void {
    const { ctx } = this
    const alert = isAnomalous(node.floor ?? 0, this.simTime)
    const color = alert ? this.palette.alert : this.palette.ok
    const p = this.screen(node)
    const r = this.s(2.3)

    if (!this.reducedMotion) {
      const period = alert ? 0.9 : 2.2
      const phase = (this.simTime % period) / period
      ctx.beginPath()
      ctx.arc(p.x, p.y, r + this.s(4) * phase, 0, Math.PI * 2)
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.6 * (1 - phase)
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    ctx.beginPath()
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
    ctx.fillStyle = this.palette.surface
    ctx.fill()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(p.x, p.y, r * 0.42, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }

  private drawConsumer(node: NetworkNode): void {
    const { ctx } = this
    const alert = isAnomalous(node.floor ?? 0, this.simTime)
    const w = 9
    const h = 7
    const topLeft = this.screen({ x: node.x - w / 2, y: node.y - h / 2 })

    this.roundedRect(topLeft.x, topLeft.y, this.s(w), this.s(h), this.s(1.2))
    ctx.fillStyle = this.palette.surface
    ctx.fill()
    ctx.strokeStyle = alert ? this.palette.alert : this.palette.stroke
    ctx.lineWidth = 1.5
    ctx.stroke()

    const center = this.screen(node)
    ctx.fillStyle = alert ? this.palette.alert : this.palette.text
    ctx.font = this.font(2.6, 600)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${node.floor ?? ''}01`, center.x, center.y)
  }

  private drawHighlight(node: NetworkNode): void {
    const { ctx } = this
    const p = this.screen(node)
    const radius = node.kind === 'tank' ? this.s(11.5) : node.kind === 'cistern' ? this.s(10) : this.s(6.2)

    ctx.save()
    ctx.strokeStyle = this.palette.highlight
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}
