import type { ReactNode } from 'react'

interface SectionHeaderProps {
  index: string
  eyebrow: string
  title: string
  id: string
  children?: ReactNode
}

export function SectionHeader({ index, eyebrow, title, id, children }: SectionHeaderProps) {
  return (
    <header className="section-head">
      <p className="eyebrow">
        <span>{index}</span>
        <span>{eyebrow}</span>
      </p>
      <h2 id={id}>{title}</h2>
      {children && <p className="lead">{children}</p>}
    </header>
  )
}
