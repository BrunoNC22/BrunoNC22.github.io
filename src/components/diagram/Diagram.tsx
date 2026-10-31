import { useId } from 'react'
import { anchor, midpoint, route, toPath, type Rect, type Side } from './route'
import './diagram.css'

export type Tone = 'default' | 'accent' | 'data' | 'shared'

export interface DiagramBox extends Rect {
  id: string
  title: string
  sub?: string
  /** Linhas extras de texto (usado no núcleo do domínio). */
  lines?: string[]
  tone?: Tone
  shape?: 'rect' | 'hex'
}

export interface DiagramArrow {
  from: string
  to: string
  fromSide: Side
  toSide: Side
  fromOffset?: number
  toOffset?: number
  label?: string
  /** Número do passo, desenhado num marcador sobre a seta. */
  step?: number
  dashed?: boolean
}

export interface DiagramGroup extends Rect {
  label: string
  note?: string
}

interface DiagramProps {
  title: string
  description: string
  width: number
  height: number
  groups?: DiagramGroup[]
  boxes: DiagramBox[]
  arrows: DiagramArrow[]
}

function hexPoints({ x, y, w, h }: Rect): string {
  const inset = h * 0.2
  return [
    [x + w / 2, y],
    [x + w, y + inset],
    [x + w, y + h - inset],
    [x + w / 2, y + h],
    [x, y + h - inset],
    [x, y + inset],
  ]
    .map(([px, py]) => `${px},${py}`)
    .join(' ')
}

function BoxShape({ box }: { box: DiagramBox }) {
  const tone = box.tone ?? 'default'
  const cx = box.x + box.w / 2
  const textLines = box.lines ?? []
  const contentHeight = 18 + (box.sub ? 16 : 0) + textLines.length * 17
  let cursor = box.y + box.h / 2 - contentHeight / 2 + 13

  return (
    <g className={`dg-box dg-box--${tone}`}>
      {box.shape === 'hex' ? (
        <polygon points={hexPoints(box)} />
      ) : (
        <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={10} />
      )}
      <text className="dg-title" x={cx} y={cursor} textAnchor="middle">
        {box.title}
      </text>
      {box.sub && (
        <text className="dg-sub" x={cx} y={(cursor += 17)} textAnchor="middle">
          {box.sub}
        </text>
      )}
      {textLines.map((line) => (
        <text key={line} className="dg-line" x={cx} y={(cursor += 17)} textAnchor="middle">
          {line}
        </text>
      ))}
    </g>
  )
}

/** Diagrama de arquitetura em SVG: caixas, grupos e setas ortogonais com rótulo. */
export function Diagram({ title, description, width, height, groups = [], boxes, arrows }: DiagramProps) {
  const markerId = useId().replace(/:/g, '')
  const byId = new Map(boxes.map((box) => [box.id, box]))

  return (
    <div className="dg-scroll" tabIndex={0} role="group" aria-label={`Diagrama: ${title}`}>
      <svg className="dg" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${markerId}-t ${markerId}-d`}>
        <title id={`${markerId}-t`}>{title}</title>
        <desc id={`${markerId}-d`}>{description}</desc>
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="dg-arrowhead" />
          </marker>
        </defs>

        {groups.map((group) => (
          <g key={group.label} className="dg-group">
            <rect x={group.x} y={group.y} width={group.w} height={group.h} rx={14} />
            <text x={group.x + 16} y={group.y + 22}>
              {group.label}
            </text>
            {group.note && (
              <text className="dg-group-note" x={group.x + group.w - 16} y={group.y + group.h - 14} textAnchor="end">
                {group.note}
              </text>
            )}
          </g>
        ))}

        {arrows.map((arrow) => {
          const from = byId.get(arrow.from)
          const to = byId.get(arrow.to)
          if (!from || !to) return null

          const start = anchor(from, arrow.fromSide, arrow.fromOffset)
          const end = anchor(to, arrow.toSide, arrow.toOffset)
          const points = route(start, arrow.fromSide, end, arrow.toSide)
          const label = midpoint(points)

          return (
            <g key={`${arrow.from}-${arrow.to}`} className={`dg-arrow ${arrow.dashed ? 'dg-arrow--dashed' : ''}`}>
              <path d={toPath(points)} markerEnd={`url(#${markerId})`} />
              {arrow.label && (
                <text x={label.x} y={label.y - 7} textAnchor="middle">
                  {arrow.label}
                </text>
              )}
              {arrow.step !== undefined && (
                <g className="dg-step">
                  <circle cx={label.x} cy={label.y} r={9} />
                  <text x={label.x} y={label.y + 3.5} textAnchor="middle">
                    {arrow.step}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {boxes.map((box) => (
          <BoxShape key={box.id} box={box} />
        ))}
      </svg>
    </div>
  )
}
