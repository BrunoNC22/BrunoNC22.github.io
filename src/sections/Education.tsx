import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { profile } from '../data/profile'
import './education.css'

const COURSES = [
  {
    title: profile.course,
    org: profile.institution,
    period: '2020 – atual',
  },
  {
    title: 'ReactJS, Hooks, Recoil, TDD, Clean Architecture, SOLID',
    org: 'Udemy · instrutor Rodrigo Manguinho · 41,5 h',
    period: 'jan/2026',
    href: 'https://ude.my/UC-0a725dad-bdab-4526-9799-b388a10c8035',
  },
]

export function Education() {
  return (
    <section className="section" aria-labelledby="formacao">
      <div className="container">
        <SectionHeader index="05" eyebrow="Formação" title="Formação" id="formacao" />

        <div className="edu">
          {COURSES.map((course, i) => (
            <Reveal key={course.title} className="edu__item card" delay={i * 60}>
              <p className="mono edu__period">{course.period}</p>
              <h3>{course.title}</h3>
              <p className="edu__org">{course.org}</p>
              {course.href && (
                <a className="edu__link" href={course.href} target="_blank" rel="noreferrer">
                  Verificar certificado <Icon name="external" />
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__title">Vamos conversar?</p>
          <p className="footer__text">
            {profile.name} · {profile.location}
          </p>
        </div>
        <div className="footer__links">
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            <Icon name="mail" />
            {profile.email}
          </a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
            <Icon name="github" />
            GitHub
          </a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
            <Icon name="linkedin" />
            LinkedIn
          </a>
        </div>
      </div>
      <div className="container footer__meta mono">
        Feito com React, TypeScript, Vite e Canvas 2D ·{' '}
        <a href={`${profile.github}/${profile.githubUser}.github.io`} target="_blank" rel="noreferrer">
          código-fonte deste site
        </a>
      </div>
    </footer>
  )
}
