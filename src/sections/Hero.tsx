import avatar from '../assets/avatar.png'
import { WaterNetwork } from '../components/WaterNetwork'
import { Icon } from '../components/ui/Icon'
import { highlights, profile } from '../data/profile'
import './hero.css'

export function Hero() {
  return (
    <header className="hero" id="topo">
      <div className="hero__backdrop" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__intro">
          <div className="hero__identity">
            <img className="hero__avatar" src={avatar} alt={`Foto de ${profile.shortName}`} width={72} height={72} />
            <div>
              <p className="hero__status">
                <span className="hero__pulse" aria-hidden="true" />
                Disponível para bolsa e projetos de P&amp;D
              </p>
              <p className="hero__course">
                {profile.course} · {profile.institution}
              </p>
            </div>
          </div>

          <h1 className="hero__title">
            {profile.name}
            <span className="hero__role">{profile.role}</span>
          </h1>

          <p className="hero__lead">
            Construo sistemas web de ponta a ponta, com <strong>TypeScript, React, Next.js e NestJS</strong>, bancos
            relacionais e não relacionais, testes automatizados e dashboards. Fui bolsista no{' '}
            <strong>Polo de Inovação do IFFluminense</strong>, onde trabalhei em P&amp;D de monitoramento hídrico com
            IoT, visualização de dados e modelos preditivos.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#estudos">
              Ver estudos de caso
              <Icon name="arrow" />
            </a>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
              <Icon name="github" />
              GitHub
            </a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
              <Icon name="linkedin" />
              LinkedIn
            </a>
            <a className="btn" href={`mailto:${profile.email}`}>
              <Icon name="mail" />
              E-mail
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <WaterNetwork />
        </div>
      </div>

      <div className="container">
        <dl className="hero__stats">
          {highlights.map((item) => (
            <div key={item.label} className="hero__stat">
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  )
}
