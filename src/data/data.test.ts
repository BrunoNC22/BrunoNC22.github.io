import { describe, expect, it } from 'vitest'
import { caseStudies } from './caseStudies'
import { professionalWork } from './professional'
import { openProjects } from './projects'
import { newTechsByEntry, timeline } from './timeline'

const allLinks = [
  ...caseStudies.flatMap((s) => [...s.links.map((l) => l.href), s.code.href]),
  ...openProjects.flatMap((p) => p.links.map((l) => l.href)),
]

describe('links', () => {
  it('todos usam https', () => {
    for (const href of allLinks) expect(href).toMatch(/^https:\/\//)
  })

  it('links para o GitHub apontam para a conta do autor', () => {
    for (const href of allLinks.filter((h) => h.includes('github.com'))) {
      expect(href).toMatch(/^https:\/\/github\.com\/BrunoNC22\//)
    }
  })
})

describe('estudos de caso', () => {
  it('têm problema, decisões, código, próximos passos e números', () => {
    for (const study of caseStudies) {
      expect(study.problem.length).toBeGreaterThan(80)
      expect(study.decisions.length).toBeGreaterThanOrEqual(3)
      expect(study.stats).toHaveLength(4)
      expect(study.nextSteps.length).toBeGreaterThan(0)
      expect(study.code.source.trim().length).toBeGreaterThan(0)
    }
  })

  it('capturas de projetos de clientes avisam que os dados são ilustrativos', () => {
    const cliente = caseStudies.find((s) => s.id === 'syriana')
    expect(cliente?.screenshot.note).toMatch(/ilustrativos/)
  })

  it('o link do código aponta para o mesmo arquivo exibido', () => {
    for (const study of caseStudies) {
      expect(study.code.href.endsWith(study.code.file)).toBe(true)
    }
  })
})

describe('trabalhos profissionais', () => {
  it('não citam o nome de clientes', () => {
    const text = JSON.stringify(professionalWork).toLowerCase()
    for (const name of ['syriana', 'lourenço', 'lourenco', 'musicme', 'ontime', 'orange week', 'auto uni']) {
      expect(text).not.toContain(name)
    }
  })
})

describe('newTechsByEntry', () => {
  const fresh = newTechsByEntry(timeline)

  it('cada tecnologia é marcada como nova em exatamente uma fase', () => {
    const all = [...fresh.values()].flat()
    expect(new Set(all).size).toBe(all.length)
    expect(new Set(all)).toEqual(new Set(timeline.flatMap((e) => e.techs)))
  })

  it('a fase mais antiga considera todas as suas tecnologias novas', () => {
    const oldest = [...timeline].sort((a, b) => a.start.localeCompare(b.start))[0]
    expect(fresh.get(oldest.id)).toEqual(oldest.techs)
  })

  it('não marca como nova uma tecnologia já usada antes', () => {
    expect(fresh.get('lrge')).not.toContain('TypeScript')
    expect(fresh.get('lrge')).toContain('Next.js')
  })
})
