import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { TechList } from '../components/ui/TechList'
import { KIND_LABEL, newTechsByEntry, timeline } from '../data/timeline'
import './timeline.css'

export function Timeline() {
  const ordered = [...timeline].sort((a, b) => b.start.localeCompare(a.start))
  const fresh = newTechsByEntry(timeline)

  let running = 0
  const totals = new Map<string, number>()
  for (const entry of [...ordered].reverse()) {
    running += fresh.get(entry.id)?.length ?? 0
    totals.set(entry.id, running)
  }

  return (
    <section className="section" aria-labelledby="trajetoria">
      <div className="container">
        <SectionHeader index="01" eyebrow="Trajetória" title="Da sala de aula à P&D e a sistemas em produção" id="trajetoria">
          Experiências, projetos e formação em ordem cronológica inversa. Em cada fase, as tecnologias{' '}
          <span className="chip chip--new tl__inline-chip">destacadas</span> são as que entraram no meu repertório
          naquele momento.
        </SectionHeader>

        <ol className="tl">
          {ordered.map((entry) => {
            const newTechs = fresh.get(entry.id) ?? []
            return (
              <Reveal as="li" key={entry.id} className={`tl__item tl__item--${entry.kind}`}>
                <div className="tl__when mono">
                  <span>{entry.period}</span>
                </div>
                <span className="tl__node" aria-hidden="true" />
                <article className="tl__card card">
                  <div className="tl__meta">
                    <span className={`tl__kind tl__kind--${entry.kind}`}>{KIND_LABEL[entry.kind]}</span>
                    <span className="tl__when-inline mono">{entry.period}</span>
                  </div>
                  <h3>{entry.title}</h3>
                  <p className="tl__org">{entry.org}</p>
                  <p className="tl__summary">{entry.summary}</p>
                  {entry.bullets.length > 0 && (
                    <ul className="tl__bullets">
                      {entry.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                  <TechList techs={entry.techs} highlight={newTechs} label={`Tecnologias usadas: ${entry.title}`} />
                  <p className="tl__count mono">
                    {newTechs.length > 0 ? `+${newTechs.length} novas · ` : ''}
                    {totals.get(entry.id)} no repertório
                  </p>
                </article>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
