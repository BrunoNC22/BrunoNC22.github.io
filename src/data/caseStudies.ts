import shoppingShot from '../assets/screenshots/shopping-list.webp'
import empregaeShot from '../assets/screenshots/empregae.webp'
import syrianaShot from '../assets/screenshots/syriana.webp'

export interface Stat {
  value: string
  label: string
}

export interface LinkItem {
  label: string
  href: string
  primary?: boolean
}

export interface Decision {
  title: string
  body: string
}

export interface CodeSample {
  file: string
  href: string
  source: string
}

export interface CaseStudy {
  id: 'shopping-list' | 'empregae' | 'syriana'
  title: string
  tagline: string
  period: string
  role: string
  stats: Stat[]
  links: LinkItem[]
  screenshot: {
    src: string
    alt: string
    url: string
    width: number
    height: number
    /** Aviso exibido sob a captura (ex.: dados fictícios). */
    note?: string
  }
  problem: string
  decisions: Decision[]
  diagramCaption: string
  code: CodeSample
  codeCaption: string
  quality: string
  nextSteps: string[]
  techs: string[]
}

const SHOPPING_REPO = 'https://github.com/BrunoNC22/shopping-list'
const EMPREGAE_API_REPO = 'https://github.com/BrunoNC22/empreg-ae-backend'
const SYRIANA_APP_REPO = 'https://github.com/BrunoNC22/syriana-dashboard-frontend'
const SYRIANA_API_REPO = 'https://github.com/BrunoNC22/syriana-dashboard-backend'

export const caseStudies: CaseStudy[] = [
  {
    id: 'shopping-list',
    title: 'Shopping List',
    tagline: 'Lista de compras que funciona offline e sincroniza quando a conexão volta.',
    period: 'jan/2026 – abr/2026',
    role: 'Autor único: domínio, frontend, API, banco e deploy',
    stats: [
      { value: '143', label: 'commits' },
      { value: '199', label: 'casos de teste' },
      { value: '34', label: 'arquivos de teste' },
      { value: '9', label: 'tipos de evento de sync' },
    ],
    links: [
      { label: 'Ver online', href: 'https://your-shopping-list.vercel.app', primary: true },
      { label: 'Repositório', href: SHOPPING_REPO },
    ],
    screenshot: {
      src: shoppingShot,
      alt: 'Tela inicial do Shopping List com uma lista de exemplo dividida por categorias e o total estimado.',
      url: 'your-shopping-list.vercel.app',
      width: 2049,
      height: 1050,
    },
    problem:
      'No supermercado o sinal de internet costuma ser fraco justamente quando a lista é usada. Se cada toque esperasse o servidor, o app travaria; se gravasse só no aparelho, os dados se perderiam ao trocar de dispositivo. O desafio era responder na hora e, mesmo assim, manter o servidor como fonte confiável.',
    decisions: [
      {
        title: 'Offline-first: toda escrita vai primeiro para o aparelho',
        body: 'A interface lê e grava no armazenamento local e nunca espera a rede. A sincronização acontece depois, em segundo plano.',
      },
      {
        title: 'Cada alteração vira um evento tipado numa fila em IndexedDB',
        body: 'Criar, editar ou excluir item, lista ou categoria gera um SyncEvent (9 tipos, com payload tipado por tipo). A fila sobrevive ao fechamento do app e é enviada em lote para POST /sync/events.',
      },
      {
        title: 'Decorator “SyncAware” em vez de espalhar sincronização pelo código',
        body: 'Os persisters local, remoto e sync-aware implementam a mesma porta (ItemPersisterOutputPort). O decorator grava localmente, enfileira o evento e dispara o motor. Os casos de uso não sabem que a sincronização existe.',
      },
      {
        title: 'Domínio num pacote compartilhado entre frontend e API',
        body: 'Entidades, casos de uso e o mapa de payloads dos eventos vivem em @shopping-list/domain (monorepo com npm workspaces). Se o formato de um evento muda, o TypeScript acusa o erro nos dois lados.',
      },
      {
        title: 'Infra simples e reproduzível',
        body: 'API em Express com Prisma e PostgreSQL, login com Google e JWT, variáveis de ambiente validadas com Zod e migrações aplicadas por um workflow do GitHub Actions.',
      },
    ],
    diagramCaption:
      'Caminho de uma alteração: (1) grava no aparelho, (2) registra o evento na fila e (3) o motor envia os pendentes em lote para a API, que aplica cada evento e persiste no PostgreSQL.',
    code: {
      file: 'apps/web/src/infra/persistance/sync-aware/SyncAwareItemPersister.ts',
      href: `${SHOPPING_REPO}/blob/main/apps/web/src/infra/persistance/sync-aware/SyncAwareItemPersister.ts`,
      source: `export class SyncAwareItemPersister implements ItemPersisterOutputPort {
  constructor(
    private readonly localItemPersister: ItemPersisterOutputPort,
    private readonly syncQueue: AddEventSyncQueueOutputPort,
    private readonly syncEngine: SyncEngineOutputPort,
    private readonly idGenerator: IdGeneratorOutputPort
  ) {}

  async save(item: Item): Promise<void> {
    await this.localItemPersister.save(item)

    const syncEventId = await this.idGenerator.generate()

    const syncEvent = new SyncEvent(
      syncEventId,
      SyncEventEnum.CREATE_ITEM,
      {
        id: item.id,
        itemListId: item.itemListId,
        name: item.name,
        // ... price, amount, categoryId, checked
      },
      new Date()
    )

    await this.syncQueue.add(syncEvent)

    this.syncEngine.trigger()
  }`,
    },
    codeCaption:
      'O decorator grava no aparelho, registra o evento na fila e dispara a sincronização sem bloquear a interface.',
    quality:
      'Testes com Vitest cobrem as entidades e os casos de uso do domínio (19 arquivos) e os adaptadores do frontend (15 arquivos): persistência local, remota e sync-aware, fila em IndexedDB e o motor de sincronização.',
    nextSteps: [
      'Disparar a sincronização também ao reconectar (evento online e Background Sync), não só após uma escrita.',
      'Aplicar os eventos no servidor em ordem de criação e com idempotência, para reenvios seguros.',
      'Resolver conflitos quando o mesmo item é editado em dois aparelhos.',
    ],
    techs: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'IndexedDB', 'Express', 'Prisma', 'PostgreSQL', 'Zod', 'Vitest', 'GitHub Actions'],
  },
  {
    id: 'empregae',
    title: 'EmpregAE',
    tagline: 'Plataforma de empregabilidade: candidatos montam o perfil e encontram vagas; empresas publicam oportunidades.',
    period: 'jul/2024 – nov/2025',
    role: 'Autor da API e da maior parte do frontend (um colaborador no layout das vagas)',
    stats: [
      { value: '187', label: 'commits' },
      { value: '45', label: 'casos de teste na API' },
      { value: '2', label: 'repositórios (web + API)' },
      { value: '3', label: 'ambientes Docker Compose' },
    ],
    links: [
      { label: 'Ver online', href: 'https://empregae.vercel.app', primary: true },
      { label: 'Frontend', href: 'https://github.com/BrunoNC22/EmpregAE' },
      { label: 'API', href: EMPREGAE_API_REPO },
    ],
    screenshot: {
      src: empregaeShot,
      alt: 'Tela de entrada do EmpregAE, com campos de nome e e-mail e o botão de login com Google.',
      url: 'empregae.vercel.app',
      width: 2049,
      height: 1140,
    },
    problem:
      'Uma plataforma de vagas cresce em várias direções: perfis de candidatos, cadastro de empresas, publicação de oportunidades, login social. Eu queria que as regras de negócio continuassem testáveis e independentes do framework, do banco e do provedor de login à medida que o produto mudasse.',
    decisions: [
      {
        title: 'API em Arquitetura Hexagonal (ports & adapters)',
        body: 'Entidades e casos de uso (Login, UpdateUser) dependem só de portas de entrada e de saída. NestJS, TypeORM e JWT ficam nos adaptadores, do lado de fora.',
      },
      {
        title: 'Presenters como portas de saída',
        body: 'O caso de uso não devolve respostas HTTP: ele chama o presenter (sucesso, usuário não encontrado, erro). Assim a regra é testada sem subir servidor, e o formato da resposta muda sem tocar no domínio.',
      },
      {
        title: 'Frontend com a mesma disciplina',
        body: 'No Vue 3, os componentes chamam casos de uso (RemoteLogin, RemoteGetOpportunities) criados por factories. Axios e localStorage ficam atrás de gateways (AxiosAdapter, LocalStorageAdapter).',
      },
      {
        title: 'Autenticação com Google OAuth e JWT',
        body: 'Login social com Passport; a API emite o próprio JWT e protege as rotas com uma estratégia JWT.',
      },
      {
        title: 'Ambientes reproduzíveis',
        body: 'PostgreSQL e API em Docker Compose com perfis de desenvolvimento, produção e AWS; documentação da API com Swagger.',
      },
    ],
    diagramCaption: 'O domínio no centro; frameworks, banco e autenticação conectados por portas.',
    code: {
      file: 'src/domain/usecases/UpdateUser.ts',
      href: `${EMPREGAE_API_REPO}/blob/main/src/domain/usecases/UpdateUser.ts`,
      source: `export class UpdateUser implements UpdateUserInputPort {
  constructor(
    private readonly userPersister: GetUserByIdOutputPort & SaveUserOutputPort,
    private readonly presenter: UpdateUserPresenterOutputPort,
  ) {}

  async updateUser(user: UpdateUserDto): Promise<void> {
    let foundUser: User | null
    try {
      foundUser = await this.userPersister.getById(user.id)
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        return this.presenter.presentUserNotFound(e)
      }
      return this.presenter.presentDefaultError(e)
    }

    if (user.name !== undefined) {
      foundUser.name = user.name
    }
    // ... demais campos opcionais (idade, cidade, e-mail)

    try {
      await this.userPersister.save(foundUser)
    } catch (e) {
      return this.presenter.presentDefaultError(e)
    }

    return this.presenter.presentSuccessUpdateUser(foundUser)
  }
}`,
    },
    codeCaption:
      'O caso de uso só conhece portas: quem persiste e quem apresenta o resultado são injetados de fora.',
    quality:
      'Testes com Jest para entidades, casos de uso, adaptadores de banco e autenticação, presenters e um teste ponta a ponta do controller de vagas, usando mocks das portas.',
    nextSteps: [
      'Levar os módulos de vagas e empresas, que ainda usam services do NestJS, para casos de uso do domínio.',
      'Fluxo de candidatura com acompanhamento de status pelo candidato.',
    ],
    techs: ['TypeScript', 'Vue 3', 'PrimeVue', 'TanStack Query', 'NestJS', 'PostgreSQL', 'TypeORM', 'Passport', 'JWT', 'Swagger', 'Jest', 'Docker'],
  },
  {
    id: 'syriana',
    title: 'Syriana Dashboard',
    tagline: 'Painel de gestão para um restaurante em funcionamento, construído sobre o banco de dados do sistema de caixa que ele já usava.',
    period: 'mai/2026 – jul/2026',
    role: 'Autor único: API, aplicativo desktop, instalador e implantação no restaurante',
    stats: [
      { value: '89', label: 'commits' },
      { value: '20', label: 'endpoints na API' },
      { value: '56', label: 'testes na API' },
      { value: '0', label: 'escritas no banco do PDV' },
    ],
    links: [
      { label: 'Aplicativo', href: SYRIANA_APP_REPO },
      { label: 'API', href: SYRIANA_API_REPO },
    ],
    screenshot: {
      src: syrianaShot,
      alt: 'Dashboard do Syriana em modo demonstração: faturamento, custo dos insumos, lucro, margem, pedidos, ticket médio, previsão de faturamento e gráficos de produtos e faturamento, todos com dados fictícios.',
      url: 'Syriana Dashboard · modo demonstração',
      width: 2049,
      height: 1230,
      note: 'Dados meramente ilustrativos, gerados somente para teste pela API de demonstração do próprio repositório (npm run demo). Não são dados do restaurante.',
    },
    problem:
      'O restaurante já registrava tudo num sistema de PDV de terceiros, mas o dono não conseguia responder perguntas simples: quanto vendeu no mês comparado ao anterior, quais produtos e horários rendem mais, quanto gastou em insumos, quanto cada garçom gerou e quanto deve comprar para o próximo mês. Eu não podia mexer no banco do PDV, que está em produção, e o painel precisava rodar no próprio computador do caixa, instalado com um clique.',
    decisions: [
      {
        title: 'Leitura direta do banco legado, sem tocar no esquema',
        body: 'A API consulta o Firebird do PDV com SQL via JDBC e nunca escreve nele. Estudei as tabelas para achar as colunas confiáveis: o código do produto nos itens do pedido vem sempre vazio, então os rankings agrupam pelo detalhe do produto.',
      },
      {
        title: 'Backend Java compilado como imagem nativa',
        body: 'A API em Spring Boot vira um www.exe com GraalVM: sobe rápido e dispensa instalar Java na máquina do cliente. O electron-builder embute esse executável no instalador.',
      },
      {
        title: 'O Electron orquestra a API',
        body: 'O processo principal inicia o www.exe, espera a API responder e grava os logs em arquivo, para eu conseguir diagnosticar problemas na máquina do cliente. Na primeira execução, uma tela escolhe o arquivo .fdb e grava a configuração que a API lê ao iniciar.',
      },
      {
        title: 'Previsão sempre acompanhada do erro',
        body: 'Faturamento e pedidos são previstos com Holt-Winters escrito em Java puro, sem bibliotecas, comparado num backtest com uma previsão sazonal simples. O método vencedor, o erro esperado (MAPE) e a faixa de confiança aparecem na tela.',
      },
      {
        title: 'KPIs que se comparam sozinhos',
        body: 'Ao escolher um período, cada indicador mostra a variação contra o período equivalente: o mesmo dia da semana passada, o mês anterior até a mesma data, ou um intervalo de mesma duração.',
      },
      {
        title: 'Lucro e compras a partir do estoque',
        body: 'O custo de cada venda vem das baixas de estoque (quantidade × preço de custo do insumo). Isso alimenta o lucro, os insumos que mais custaram e um relatório de previsão de compras exportável em PDF e CSV.',
      },
    ],
    diagramCaption:
      'Tudo roda no computador do restaurante: o aplicativo inicia a API nativa, que lê o banco do PDV sem escrever nada nele.',
    code: {
      file: 'src/renderer/src/kpis/periodComparison.ts',
      href: `${SYRIANA_APP_REPO}/blob/main/src/renderer/src/kpis/periodComparison.ts`,
      source: `function comparacaoPeriodoAnterior(range: DateRange, today: Date): PeriodComparison {
  const { start, end } = range

  // Dia específico
  if (isSameDay(start, end)) {
    return montar(
      range,
      { start: subWeeks(start, 1), end: subWeeks(end, 1) },
      'em relação ao mesmo dia da semana passada',
      'periodo-anterior'
    )
  }

  // Mês completo
  if (isSameDay(start, startOfMonth(start)) && isSameDay(end, endOfMonth(start))) {
    const isCurrentMonth =
      start.getFullYear() === today.getFullYear() && start.getMonth() === today.getMonth()
    if (isCurrentMonth) {
      // Mês corrente: compara do dia 1 até hoje contra o mesmo intervalo do mês anterior.
      const previousEnd = subMonths(today, 1)
      return montar(
        range,
        { start: startOfMonth(previousEnd), end: previousEnd },
        'em relação ao mês anterior (até hoje)',
        'periodo-anterior'
      )
    }
    // ... mês passado, ano, semana e intervalo livre seguem a mesma ideia
  }`,
    },
    codeCaption:
      'Comparar o mês corrente com o mês anterior inteiro faria todo início de mês parecer uma queda; por isso a comparação vai só até a mesma data.',
    quality:
      'A API tem 56 testes com JUnit: testes de endpoint (@WebMvcTest) para seis controllers e testes unitários da previsão e do calendário de feriados, com os repositórios simulados, então rodam sem banco. Antes de cada entrega, um teste de fumaça sobe o executável com a configuração real e confere se a API responde.',
    nextSteps: [
      'Testes no aplicativo, começando pela comparação de períodos, que tem muitos casos de borda com datas.',
      'Testes de integração das consultas SQL contra um banco Firebird de teste; hoje os testes simulam os repositórios.',
      'Ativar a atualização automática do aplicativo (o electron-updater já está no projeto).',
    ],
    techs: ['Java', 'Spring Boot', 'JDBC', 'Firebird', 'GraalVM', 'JUnit', 'Electron', 'React', 'TypeScript', 'TanStack Query', 'Chart.js', 'Tailwind CSS'],
  },
]
