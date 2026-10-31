export type TimelineKind = 'experiencia' | 'projeto' | 'formacao'

export interface TimelineEntry {
  id: string
  kind: TimelineKind
  /** Data de início no formato AAAA-MM, usada para ordenar. */
  start: string
  period: string
  title: string
  org: string
  summary: string
  bullets: string[]
  techs: string[]
}

export const KIND_LABEL: Record<TimelineKind, string> = {
  experiencia: 'Experiência',
  projeto: 'Projeto',
  formacao: 'Formação',
}

export const timeline: TimelineEntry[] = [
  {
    id: 'iff',
    kind: 'formacao',
    start: '2020-03',
    period: '2020 – atual',
    title: 'Bacharelado em Sistemas de Informação',
    org: 'IFFluminense · Campus Campos Centro',
    summary: 'Base em algoritmos, engenharia de software e desenvolvimento web.',
    bullets: [
      'Primeiros sistemas em Java: manipulação de dados em CSV e um sistema web de locação.',
      'Projetos acadêmicos de otimização (metaheurística GRASP) e lógica fuzzy.',
    ],
    techs: ['Java', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'picg',
    kind: 'experiencia',
    start: '2023-02',
    period: 'fev/2023 – out/2024',
    title: 'Bolsista ENS-A · Engenharia de Software',
    org: 'Polo de Inovação Campos dos Goytacazes (IFFluminense / Embrapii)',
    summary:
      'Projeto PIFF-2212.0036, “Otimização de Hardware e Software de Sistema de Economia de Água Predial”, com 20 h semanais.',
    bullets: [
      'Biblioteca em TypeScript sobre HTML5 Canvas que desenha instalações hídricas como grafos, com dados operacionais em tempo real. A animação do topo desta página é uma releitura dessa ideia.',
      'Interfaces web em Vue.js para visualizar sensores e históricos de consumo.',
      'Extrator automatizado que importa planilhas para MySQL.',
      'Modelos de machine learning em Python para prever consumo de água com variáveis sazonais.',
    ],
    techs: ['TypeScript', 'JavaScript', 'Vue.js', 'HTML5 Canvas', 'Python', 'Machine Learning', 'MySQL'],
  },
  {
    id: 'empregae',
    kind: 'projeto',
    start: '2024-07',
    period: 'jul/2024 – nov/2025',
    title: 'EmpregAE',
    org: 'Projeto próprio · código aberto',
    summary: 'Plataforma de empregabilidade com frontend e API próprios.',
    bullets: ['API em NestJS com Arquitetura Hexagonal, PostgreSQL, JWT e login com Google.'],
    techs: ['TypeScript', 'Vue.js', 'NestJS', 'PostgreSQL', 'TypeORM', 'Docker', 'Arquitetura Hexagonal', 'Jest'],
  },
  {
    id: 'td',
    kind: 'experiencia',
    start: '2024-10',
    period: 'out/2024 – ago/2025',
    title: 'Engenheiro de Software',
    org: 'T&D Sustentável',
    summary: 'Desenvolvimento full stack e integração de sistemas IoT de monitoramento hídrico.',
    bullets: [
      'Microsserviços em FastAPI, validados com testes de carga em Gatling.',
      'Dashboards em Vue.js e Gridstack com dados de sensores em tempo real (HTTP e MQTT).',
      'Automações em NestJS que extraem dados de planilhas e alimentam ferramentas de Business Intelligence.',
      'Deploy automatizado com Docker, GitHub Actions, Ansible e semantic-release.',
    ],
    techs: ['Python', 'FastAPI', 'TypeScript', 'Vue.js', 'NestJS', 'MongoDB', 'MQTT', 'Docker', 'NGINX', 'GitHub Actions', 'Ansible', 'Gatling', 'Business Intelligence'],
  },
  {
    id: 'lrge',
    kind: 'experiencia',
    start: '2025-07',
    period: 'jul/2025 – out/2025',
    title: 'Engenheiro de Software',
    org: 'LRGE Systems',
    summary: 'Modernização de sistemas com arquitetura limpa e desenvolvimento orientado a testes.',
    bullets: [
      'Migração de uma aplicação legada em PHP para Next.js.',
      'Funcionalidades com TDD e Arquitetura Hexagonal; refatoração de módulos críticos com SOLID.',
      'Filas assíncronas com Laravel Queues e Redis; modelagem em PostgreSQL.',
    ],
    techs: ['TypeScript', 'Next.js', 'React', 'PHP', 'Laravel', 'Redis', 'PostgreSQL', 'Docker', 'TDD', 'Arquitetura Hexagonal'],
  },
  {
    id: 'freela',
    kind: 'experiencia',
    start: '2025-12',
    period: 'dez/2025 – atual',
    title: 'Desenvolvedor Full Stack',
    org: 'Projetos para clientes, sob confidencialidade',
    summary: 'Sistemas de gestão e plataformas web desenvolvidos de ponta a ponta, sozinho ou em equipe.',
    bullets: [
      'Sistema de gestão para agência de marketing e plataforma de músicas sob demanda (Next.js + NestJS + MongoDB).',
      'Dashboard desktop para restaurante e atendimento via WhatsApp com IA.',
    ],
    techs: ['Next.js', 'React', 'NestJS', 'MongoDB', 'PostgreSQL', 'Stripe', 'Socket.IO', 'Electron', 'Java', 'Spring Boot', 'OpenAI API', 'Jest', 'Vitest', 'Docker'],
  },
  {
    id: 'shopping',
    kind: 'projeto',
    start: '2026-01',
    period: 'jan/2026 – abr/2026',
    title: 'Shopping List',
    org: 'Projeto próprio · código aberto',
    summary: 'App de compras que funciona offline e sincroniza quando a conexão volta.',
    bullets: ['199 casos de teste, domínio compartilhado entre frontend e API, sincronização por eventos.'],
    techs: ['TypeScript', 'React', 'Express', 'Prisma', 'PostgreSQL', 'IndexedDB', 'Vitest', 'GitHub Actions', 'Monorepo'],
  },
  {
    id: 'basemat',
    kind: 'projeto',
    start: '2026-09',
    period: 'set/2026 – out/2026',
    title: 'Jogo educativo de matemática em tempo real',
    org: 'Projeto em equipe · apresentado na Mostra de Extensão da UENF',
    summary: 'O projetor mostra o jogo e os alunos respondem pelo celular, via QR code.',
    bullets: ['Partidas sincronizadas em tempo real com Socket.IO; ambiente completo em Docker.'],
    techs: ['React', 'TypeScript', 'NestJS', 'Socket.IO', 'Prisma', 'SQLite', 'Vitest', 'Docker', 'Caddy'],
  },
]

/**
 * Para cada entrada, as tecnologias que aparecem pela primeira vez na trajetória.
 * Mostra a evolução: o que cada fase acrescentou ao repertório.
 */
export function newTechsByEntry(entries: TimelineEntry[]): Map<string, string[]> {
  const seen = new Set<string>()
  const result = new Map<string, string[]>()

  const ordered = [...entries].sort((a, b) => a.start.localeCompare(b.start))
  for (const entry of ordered) {
    const fresh = entry.techs.filter((tech) => !seen.has(tech))
    fresh.forEach((tech) => seen.add(tech))
    result.set(entry.id, fresh)
  }

  return result
}
