interface TechListProps {
  techs: string[]
  highlight?: string[]
  label?: string
}

export function TechList({ techs, highlight = [], label = 'Tecnologias' }: TechListProps) {
  return (
    <ul className="chips" aria-label={label}>
      {techs.map((tech) => (
        <li key={tech} className={`chip ${highlight.includes(tech) ? 'chip--new' : ''}`.trim()}>
          {tech}
        </li>
      ))}
    </ul>
  )
}
