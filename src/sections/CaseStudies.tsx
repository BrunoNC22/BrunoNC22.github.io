import type { ComponentType } from 'react'
import { EmpregaeDiagram, ShoppingListDiagram, SyrianaDiagram } from '../components/diagram/architectures'
import { BrowserFrame } from '../components/ui/BrowserFrame'
import { CodeBlock } from '../components/ui/CodeBlock'
import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { TechList } from '../components/ui/TechList'
import { caseStudies, type CaseStudy, type ContextCard } from '../data/caseStudies'
import './case-study.css'

const DIAGRAMS: Record<CaseStudy['id'], ComponentType> = {
  'shopping-list': ShoppingListDiagram,
  empregae: EmpregaeDiagram,
  syriana: SyrianaDiagram,
}

function Context({ context }: { context: ContextCard }) {
  return (
    <div className="cs__context card">
      <p className="cs__context-note">
        <Icon name="lock" />
        {context.note}
      </p>
      <dl>
        {context.facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function CaseStudyArticle({ study, index }: { study: CaseStudy; index: number }) {
  const DiagramComponent = DIAGRAMS[study.id]
  const number = String(index + 1).padStart(2, '0')

  return (
    <article className="cs" aria-labelledby={`cs-${study.id}`}>
      <Reveal className="cs__head">
        <div className="cs__heading">
          <p className="eyebrow">Estudo de caso {number}</p>
          <h3 id={`cs-${study.id}`} className="cs__title">
            {study.title}
          </h3>
          <p className="cs__tagline">{study.tagline}</p>
          <p className="cs__role mono">
            {study.period} · {study.role}
          </p>
        </div>
        <div className="cs__links">
          {study.links.map((link) => (
            <a
              key={link.href}
              className={`btn ${link.primary ? 'btn--primary' : ''}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name={link.primary ? 'external' : 'github'} />
              {link.label}
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal as="dl" className="cs__stats">
        {study.stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </Reveal>

      <div className="cs__intro">
        <Reveal>
          {study.screenshot ? <BrowserFrame {...study.screenshot} /> : study.context && <Context context={study.context} />}
        </Reveal>
        <Reveal className="cs__problem" delay={80}>
          <h4 className="cs__label">O problema</h4>
          <p>{study.problem}</p>
          <TechList techs={study.techs} label={`Tecnologias do ${study.title}`} />
        </Reveal>
      </div>

      <div className="cs__block">
        <h4 className="cs__label">Decisões técnicas</h4>
        <ol className="cs__decisions">
          {study.decisions.map((decision, i) => (
            <Reveal as="li" key={decision.title} className="cs__decision card" delay={i * 50}>
              <span className="cs__decision-n mono">{String(i + 1).padStart(2, '0')}</span>
              <h5>{decision.title}</h5>
              <p>{decision.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal as="figure" className="cs__block cs__figure">
        <DiagramComponent />
        <figcaption>
          <span className="mono">fig. {number}a · arquitetura</span> {study.diagramCaption}
        </figcaption>
      </Reveal>

      <div className="cs__bottom">
        <Reveal className="cs__code">
          <CodeBlock {...study.code} />
          <p className="cs__caption">
            <span className="mono">fig. {number}b · código real</span> {study.codeCaption}
          </p>
        </Reveal>

        <Reveal className="cs__notes" delay={80}>
          <div className="cs__note card">
            <h4 className="cs__label">Qualidade e testes</h4>
            <p>{study.quality}</p>
          </div>
          <div className="cs__note card">
            <h4 className="cs__label">Próximos passos</h4>
            <ul>
              {study.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </article>
  )
}

export function CaseStudies() {
  return (
    <section className="section" aria-labelledby="estudos">
      <div className="container">
        <SectionHeader index="02" eyebrow="Estudos de caso" title="Como penso e construo um sistema" id="estudos">
          Três projetos meus, um deles em uso num restaurante, contados por dentro: o problema, as decisões de
          arquitetura, um trecho real do código e o que eu faria a seguir. Todo o histórico de commits está público no
          GitHub.
        </SectionHeader>

        <div className="cs-list">
          {caseStudies.map((study, index) => (
            <CaseStudyArticle key={study.id} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
