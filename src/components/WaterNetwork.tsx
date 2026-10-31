import { useEffect, useMemo, useRef, useState } from 'react'
import { createBuildingNetwork } from '../canvas/network'
import { isInteractive, readNode } from '../canvas/readings'
import { WaterNetworkRenderer, type NodePosition, type Palette } from '../canvas/renderer'
import { prefersReducedMotion } from '../lib/theme'
import './water-network.css'

const PALETTE_VARS: Record<keyof Palette, string> = {
  grid: '--wg-grid',
  slab: '--wg-slab',
  pipe: '--wg-pipe',
  pipeCore: '--wg-pipe-core',
  water: '--wg-water',
  particle: '--wg-particle',
  surface: '--wg-surface',
  stroke: '--wg-stroke',
  text: '--wg-text',
  muted: '--wg-muted',
  ok: '--wg-ok',
  alert: '--wg-alert',
  highlight: '--wg-highlight',
}

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement)
  const entries = Object.entries(PALETTE_VARS).map(([key, cssVar]) => [key, styles.getPropertyValue(cssVar).trim()])
  return Object.fromEntries(entries) as Palette
}

/** Simulação interativa de uma rede hidráulica predial (canvas 2D + leituras em HTML acessível). */
export function WaterNetwork() {
  const network = useMemo(() => createBuildingNetwork(), [])
  const frameRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<WaterNetworkRenderer | null>(null)
  const [positions, setPositions] = useState<NodePosition[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [supported, setSupported] = useState(true)
  const [, setTick] = useState(0)

  useEffect(() => {
    const frame = frameRef.current
    const canvas = canvasRef.current
    if (!frame || !canvas) return

    let renderer: WaterNetworkRenderer
    try {
      renderer = new WaterNetworkRenderer(canvas, network, {
        palette: readPalette(),
        reducedMotion: prefersReducedMotion(),
      })
    } catch {
      setSupported(false)
      return
    }
    rendererRef.current = renderer

    let onScreen = true
    const sync = () => (onScreen && !document.hidden ? renderer.start() : renderer.stop())

    const layout = () => {
      const { width, height } = frame.getBoundingClientRect()
      renderer.resize(width, height)
      setPositions(renderer.nodePositions())
    }
    layout()

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(layout) : null
    resizeObserver?.observe(frame)

    const visibilityObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting
            sync()
          })
        : null
    visibilityObserver?.observe(frame)

    const themeObserver = new MutationObserver(() => renderer.setPalette(readPalette()))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    document.addEventListener('visibilitychange', sync)
    sync()

    return () => {
      renderer.stop()
      resizeObserver?.disconnect()
      visibilityObserver?.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      rendererRef.current = null
    }
  }, [network])

  useEffect(() => {
    rendererRef.current?.setHighlighted(activeId)
    if (!activeId) return
    const interval = window.setInterval(() => setTick((n) => n + 1), 250)
    return () => window.clearInterval(interval)
  }, [activeId])

  const active = positions.find((p) => p.node.id === activeId)
  const reading = active ? readNode(active.node, rendererRef.current?.time ?? 0) : null
  const frameWidth = frameRef.current?.clientWidth ?? 0
  const frameHeight = frameRef.current?.clientHeight ?? 0
  const tooltipOnLeft = active ? active.x > frameWidth * 0.55 : false
  // Mantém o painel inteiro dentro do quadro, mesmo para componentes perto da borda.
  const tooltipTop = active ? Math.min(Math.max(active.y, 64), Math.max(64, frameHeight - 64)) : 0

  return (
    <figure className="wn">
      <div className="wn__frame" ref={frameRef}>
        <canvas
          ref={canvasRef}
          className="wn__canvas"
          role="img"
          aria-label="Simulação de uma instalação hidráulica predial: cisterna, bomba, caixa d’água e quatro andares com hidrômetros. A água flui pelos canos e o hidrômetro do 2º andar acusa uma anomalia de consumo de tempos em tempos."
        />

        {!supported && <p className="wn__fallback">Simulação indisponível neste navegador.</p>}

        {positions
          .filter((p) => isInteractive(p.node))
          .map((p) => (
            <button
              key={p.node.id}
              type="button"
              className="wn__hit"
              style={{ left: p.x, top: p.y }}
              aria-label={`Ver leituras: ${p.node.label}`}
              aria-describedby={activeId === p.node.id ? 'wn-reading' : undefined}
              onMouseEnter={() => setActiveId(p.node.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(p.node.id)}
              onBlur={() => setActiveId(null)}
              onClick={() => setActiveId((current) => (current === p.node.id ? null : p.node.id))}
            />
          ))}

        {active && reading && (
          <div
            id="wn-reading"
            role="status"
            className={`wn__tip wn__tip--${reading.status} ${tooltipOnLeft ? 'wn__tip--left' : ''}`}
            style={{ left: active.x, top: tooltipTop }}
          >
            <strong>{reading.title}</strong>
            <span className="wn__status">{reading.statusLabel}</span>
            {reading.rows.length > 0 && (
              <dl>
                {reading.rows.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}
      </div>

      <figcaption className="wn__caption">
        <span className="mono wn__fig">fig. 01 · simulação</span>
        <span>
          Passe o mouse ou toque nos componentes para ver as leituras. Releitura da biblioteca em TypeScript + Canvas que
          desenvolvi no Polo de Inovação para exibir instalações hídricas como grafos.
        </span>
        <span className="wn__legend" aria-hidden="true">
          <span>
            <i className="wn__dot wn__dot--water" />
            fluxo de água
          </span>
          <span>
            <i className="wn__dot wn__dot--ok" />
            hidrômetro normal
          </span>
          <span>
            <i className="wn__dot wn__dot--alert" />
            anomalia de consumo
          </span>
        </span>
      </figcaption>
    </figure>
  )
}
