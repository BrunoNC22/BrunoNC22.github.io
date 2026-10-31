import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { TechList } from '../components/ui/TechList'
import { openProjects } from '../data/projects'
import { profile } from '../data/profile'
import './cards.css'

export function OpenSource() {
  return (
    <section className="section" aria-labelledby="projetos">
      <div className="container">
        <SectionHeader index="03" eyebrow="Mais projetos abertos" title="Outros projetos com autoria verificável" id="projetos">
          Projetos acadêmicos e de estudo, todos na conta{' '}
          <a href={profile.github} target="_blank" rel="noreferrer">
            github.com/{profile.githubUser}
          </a>
          .
        </SectionHeader>

        <div className="pgrid">
          {openProjects.map((project, i) => (
            <Reveal as="article" key={project.id} className={`pcard card ${project.screenshot ? 'pcard--wide' : ''}`} delay={i * 60}>
              {project.screenshot && (
                <div className="pcard__shot">
                  <img
                    src={project.screenshot.src}
                    alt={project.screenshot.alt}
                    width={project.screenshot.width}
                    height={project.screenshot.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="pcard__body">
                <p className="pcard__meta mono">
                  {project.period}
                  {project.commits ? ` · ${project.commits} commits` : ''}
                </p>
                <h3>{project.title}</h3>
                <p className="pcard__desc">{project.description}</p>
                <TechList techs={project.techs} label={`Tecnologias: ${project.title}`} />
                <div className="pcard__links">
                  {project.links.map((link) => (
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
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
