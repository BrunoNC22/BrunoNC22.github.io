export interface ProfessionalWork {
  id: string
  title: string
  period: string
  team: string
  description: string
  techs: string[]
}

/** Trabalhos para clientes: sem nomes de clientes e sem código, por confidencialidade. */
export const professionalWork: ProfessionalWork[] = [
  {
    id: 'agencia',
    title: 'Sistema de gestão para agência de marketing',
    period: 'dez/2025 – atual',
    team: 'Em equipe',
    description:
      'Plataforma interna para planejar e acompanhar as postagens de cada cliente, controlar responsáveis e prazos e gerar relatórios financeiros.',
    techs: ['Next.js', 'React', 'NestJS', 'MongoDB', 'Jest', 'Vitest'],
  },
  {
    id: 'musica',
    title: 'Plataforma de músicas sob demanda',
    period: 'fev/2026 – atual',
    team: 'Em equipe',
    description:
      'Catálogo de faixas, pedidos de produção personalizada com chat em tempo real e assinaturas com pagamento online.',
    techs: ['Next.js', 'NestJS', 'MongoDB', 'Socket.IO', 'Stripe', 'Jest'],
  },
  {
    id: 'restaurante',
    title: 'Dashboard de gestão para restaurante',
    period: 'mai/2026 – jul/2026',
    team: 'Individual',
    description: 'Aplicação desktop com indicadores de vendas e operação, alimentada pelo banco de dados do sistema do restaurante.',
    techs: ['Electron', 'React', 'TypeScript', 'Java', 'Spring Boot', 'Nx'],
  },
  {
    id: 'whatsapp',
    title: 'Atendimento via WhatsApp com IA',
    period: 'jul/2026',
    team: 'Desenvolvedor principal',
    description:
      'Assistente de IA que atende os clientes de uma autoescola pelo WhatsApp, com painel web para conectar o número e configurar o comportamento da IA.',
    techs: ['NestJS', 'React', 'MongoDB', 'OpenAI API'],
  },
  {
    id: 'jogo',
    title: 'Jogo educativo de matemática em tempo real',
    period: 'set/2026 – out/2026',
    team: 'Em equipe',
    description:
      'Jogos de matemática para sala de aula: o projetor mostra a partida e os alunos respondem pelo celular via QR code. Apresentado na Mostra de Extensão da UENF.',
    techs: ['React', 'TypeScript', 'NestJS', 'Socket.IO', 'Prisma', 'Vitest', 'Docker'],
  },
  {
    id: 'advocacia',
    title: 'Site institucional para escritório de advocacia',
    period: '2026',
    team: 'Individual',
    description: 'Site responsivo com apresentação das áreas de atuação e canais de contato.',
    techs: ['TypeScript', 'React'],
  },
]
