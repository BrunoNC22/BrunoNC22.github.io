export const profile = {
  name: 'Bruno Nascimento Campos',
  shortName: 'Bruno Nascimento',
  role: 'Desenvolvedor Full Stack',
  course: 'Bacharelado em Sistemas de Informação',
  institution: 'IFFluminense · Campus Campos Centro',
  location: 'Campos dos Goytacazes, RJ',
  email: 'bruno.nascimento.campos00@gmail.com',
  githubUser: 'BrunoNC22',
  github: 'https://github.com/BrunoNC22',
  linkedin: 'https://www.linkedin.com/in/bruno-nascimento-09771338a',
}

export interface Highlight {
  value: string
  label: string
}

export const highlights: Highlight[] = [
  { value: '1 ano e 9 meses', label: 'como bolsista ENS-A em projeto Embrapii no Polo de Inovação' },
  { value: '244', label: 'testes automatizados nos projetos de código aberto' },
  { value: '1.800+', label: 'contribuições no GitHub desde 2022' },
  { value: '3+ anos', label: 'desenvolvendo software profissionalmente, desde 2023' },
]
