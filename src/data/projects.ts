import aguaShot from '../assets/screenshots/qualidade-agua.webp'

export interface OpenProject {
  id: string
  title: string
  period: string
  commits?: number
  description: string
  techs: string[]
  links: Array<{ label: string; href: string; primary?: boolean }>
  screenshot?: { src: string; alt: string; width: number; height: number }
}

export const openProjects: OpenProject[] = [
  {
    id: 'qualidade-agua',
    title: 'Avaliação da Qualidade da Água',
    period: 'set/2023',
    commits: 42,
    description:
      'Sistema baseado em regras fuzzy que classifica a potabilidade da água a partir de pH, turbidez e cor aparente, com gráficos das funções de pertinência e simulação interativa.',
    techs: ['Vue 3', 'JavaScript', 'Chart.js', 'Lógica Fuzzy'],
    links: [
      { label: 'Ver online', href: 'https://avaliacao-da-qualidade-da-agua.vercel.app', primary: true },
      { label: 'Repositório', href: 'https://github.com/BrunoNC22/AvaliacaoDaQualidadeDeAgua' },
    ],
    screenshot: {
      src: aguaShot,
      alt: 'Página do sistema fuzzy de avaliação da qualidade da água, com menu lateral de seções.',
      width: 2049,
      height: 1230,
    },
  },
  {
    id: 'grasp',
    title: 'Metaheurística GRASP: Problema da Mochila',
    period: 'ago/2023 – set/2023',
    commits: 25,
    description:
      'Resolve o Problema da Mochila Binária com construção gulosa aleatorizada (GRASP), com API em Java e interface web para visualizar as soluções.',
    techs: ['Java', 'React', 'Otimização combinatória'],
    links: [
      { label: 'Algoritmo', href: 'https://github.com/BrunoNC22/GRASP' },
      { label: 'API', href: 'https://github.com/BrunoNC22/Metaheuristica-Grasp-Api' },
      { label: 'Interface', href: 'https://github.com/BrunoNC22/Metaheuristica-Grasp-View' },
    ],
  },
  {
    id: 'socket',
    title: 'Socket Message Protocol',
    period: 'dez/2023 – ago/2024',
    description:
      'Servidor e cliente TCP em Node.js com um protocolo próprio de troca de mensagens (PTMP), broadcast entre clientes e tratamento de requisições HTTP.',
    techs: ['Node.js', 'TCP sockets', 'Redes'],
    links: [{ label: 'Repositório', href: 'https://github.com/BrunoNC22/Socket-Message-Protocol' }],
  },
  {
    id: 'locacao',
    title: 'Sistema de Locação',
    period: 'dez/2022 – mai/2023',
    commits: 47,
    description: 'Sistema web de locação desenvolvido na disciplina de Desenvolvimento Web do curso de Sistemas de Informação.',
    techs: ['Java', 'HTML', 'JavaScript'],
    links: [{ label: 'Repositório', href: 'https://github.com/BrunoNC22/Sistema-de-Locacao' }],
  },
]
