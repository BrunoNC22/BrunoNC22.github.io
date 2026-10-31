import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { TechList } from '../components/ui/TechList'
import { professionalWork } from '../data/professional'
import './cards.css'

export function Professional() {
  return (
    <section className="section" aria-labelledby="profissional">
      <div className="container">
        <SectionHeader index="04" eyebrow="Trabalhos profissionais" title="Sistemas feitos para clientes" id="profissional">
          Por confidencialidade, os clientes não são identificados e o código não é publicado. Os detalhes técnicos podem
          ser apresentados em entrevista.
        </SectionHeader>

        <div className="wgrid">
          {professionalWork.map((work, i) => (
            <Reveal as="article" key={work.id} className="wcard card" delay={(i % 3) * 60}>
              <div className="wcard__top">
                <span className="wcard__lock" title="Código privado">
                  <Icon name="lock" />
                </span>
                <p className="mono">
                  {work.period} · {work.team}
                </p>
              </div>
              <h3>{work.title}</h3>
              <p className="wcard__desc">{work.description}</p>
              <TechList techs={work.techs} label={`Tecnologias: ${work.title}`} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
