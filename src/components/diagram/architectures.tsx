import { Diagram } from './Diagram'

export function ShoppingListDiagram() {
  return (
    <Diagram
      title="Arquitetura de sincronização do Shopping List"
      description="No navegador, a interface chama casos de uso; o decorator SyncAware grava no armazenamento local, registra um evento na fila em IndexedDB e o SyncEngine envia os eventos pendentes em lote para a API Express, que aplica cada evento com um handler por tipo e persiste no PostgreSQL via Prisma. Entidades, casos de uso e tipos de evento ficam num pacote de domínio compartilhado pelos dois lados."
      width={800}
      height={470}
      groups={[
        { label: 'NAVEGADOR · FUNCIONA OFFLINE', x: 16, y: 16, w: 476, h: 372 },
        { label: 'SERVIDOR', x: 516, y: 16, w: 268, h: 372 },
      ]}
      boxes={[
        { id: 'ui', title: 'Interface React', sub: 'ação do usuário', x: 40, y: 52, w: 200, h: 54 },
        { id: 'uc', title: 'Casos de uso', sub: 'CreateItem, EditItem…', x: 40, y: 136, w: 200, h: 54 },
        { id: 'sa', title: 'SyncAwarePersister', sub: 'decorator', x: 40, y: 220, w: 200, h: 54, tone: 'accent' },
        { id: 'local', title: 'Persistência local', sub: 'localStorage', x: 40, y: 304, w: 200, h: 54 },
        { id: 'queue', title: 'Fila de eventos', sub: 'IndexedDB · 9 tipos', x: 268, y: 220, w: 200, h: 54, tone: 'accent' },
        { id: 'engine', title: 'SyncEngine', sub: 'envio em lote', x: 268, y: 304, w: 200, h: 54 },
        { id: 'auth', title: 'Autenticação', sub: 'login Google → JWT', x: 540, y: 52, w: 220, h: 54 },
        { id: 'api', title: 'API Express', sub: 'POST /sync/events', x: 540, y: 136, w: 220, h: 54 },
        { id: 'handler', title: 'Handler por tipo', sub: 'CREATE_ITEM, EDIT_ITEM…', x: 540, y: 220, w: 220, h: 54 },
        { id: 'db', title: 'PostgreSQL', sub: 'via Prisma', x: 540, y: 304, w: 220, h: 54, tone: 'data' },
        {
          id: 'domain',
          title: '@shopping-list/domain',
          sub: 'entidades, casos de uso e tipos de evento compartilhados pelo frontend e pela API',
          x: 16,
          y: 404,
          w: 768,
          h: 52,
          tone: 'shared',
        },
      ]}
      arrows={[
        { from: 'ui', to: 'uc', fromSide: 'bottom', toSide: 'top' },
        { from: 'uc', to: 'sa', fromSide: 'bottom', toSide: 'top' },
        { from: 'sa', to: 'local', fromSide: 'bottom', toSide: 'top', step: 1 },
        { from: 'sa', to: 'queue', fromSide: 'right', toSide: 'left', step: 2 },
        { from: 'queue', to: 'engine', fromSide: 'bottom', toSide: 'top', step: 3 },
        { from: 'engine', to: 'api', fromSide: 'right', toSide: 'left', label: 'HTTPS' },
        { from: 'auth', to: 'api', fromSide: 'bottom', toSide: 'top', dashed: true },
        { from: 'api', to: 'handler', fromSide: 'bottom', toSide: 'top' },
        { from: 'handler', to: 'db', fromSide: 'bottom', toSide: 'top' },
      ]}
    />
  )
}

export function SyrianaDiagram() {
  return (
    <Diagram
      title="Arquitetura do Syriana Dashboard"
      description="No computador do restaurante, o aplicativo Electron tem uma interface React que busca os indicadores com TanStack Query na API local por HTTP. O processo principal do Electron inicia a API e grava a configuração com o caminho do banco. A API, em Spring Boot compilada como imagem nativa, lê essa configuração, consulta o banco Firebird do sistema de PDV por JDBC, somente leitura, enquanto o próprio PDV continua gravando os pedidos e o estoque nesse banco."
      width={800}
      height={440}
      groups={[
        { label: 'APLICATIVO ELECTRON', x: 16, y: 16, w: 300, h: 336 },
        { label: 'API LOCAL · IMAGEM NATIVA', x: 340, y: 16, w: 210, h: 336 },
        { label: 'PDV · DE TERCEIROS', x: 574, y: 16, w: 210, h: 336 },
      ]}
      boxes={[
        { id: 'ui', title: 'Interface React', sub: 'KPIs, gráficos, garçons', x: 40, y: 52, w: 252, h: 54 },
        { id: 'query', title: 'TanStack Query', sub: 'cache e estados de carga', x: 40, y: 128, w: 252, h: 54 },
        { id: 'main', title: 'Processo principal', sub: 'inicia a API · logs · login', x: 40, y: 204, w: 252, h: 54, tone: 'accent' },
        { id: 'config', title: 'server-config.json', sub: 'arquivo .fdb, host, porta', x: 40, y: 280, w: 252, h: 54 },
        { id: 'api', title: 'API Spring Boot', sub: '20 endpoints REST', x: 364, y: 52, w: 162, h: 54 },
        { id: 'repo', title: 'Repositórios', sub: 'SQL via JdbcTemplate', x: 364, y: 166, w: 162, h: 54, tone: 'accent' },
        { id: 'ds', title: 'DataSource', sub: 'Hikari + Jaybird', x: 364, y: 280, w: 162, h: 54 },
        { id: 'pdv', title: 'PDV do restaurante', sub: 'pedidos, caixa, estoque', x: 598, y: 52, w: 162, h: 54 },
        { id: 'fdb', title: 'Banco Firebird', sub: 'arquivo .fdb', x: 598, y: 280, w: 162, h: 54, tone: 'data' },
        {
          id: 'pc',
          title: 'Computador do caixa · Windows',
          sub: 'um instalador com a API embutida; sem nuvem e sem Java instalado',
          x: 16,
          y: 372,
          w: 768,
          h: 52,
          tone: 'shared',
        },
      ]}
      arrows={[
        { from: 'ui', to: 'query', fromSide: 'bottom', toSide: 'top' },
        { from: 'query', to: 'api', fromSide: 'right', toSide: 'left', label: 'HTTP' },
        { from: 'main', to: 'config', fromSide: 'bottom', toSide: 'top', dashed: true },
        { from: 'config', to: 'ds', fromSide: 'right', toSide: 'left', dashed: true },
        { from: 'api', to: 'repo', fromSide: 'bottom', toSide: 'top' },
        { from: 'repo', to: 'ds', fromSide: 'bottom', toSide: 'top' },
        { from: 'ds', to: 'fdb', fromSide: 'right', toSide: 'left', label: 'leitura' },
        { from: 'pdv', to: 'fdb', fromSide: 'bottom', toSide: 'top', label: 'grava' },
      ]}
    />
  )
}

export function EmpregaeDiagram() {
  return (
    <Diagram
      title="Arquitetura do EmpregAE"
      description="O frontend em Vue 3 chama casos de uso criados por factories, que usam gateways (Axios e localStorage) para falar com a API. Na API NestJS, controllers REST e as estratégias de autenticação (Google OAuth e JWT) chegam ao domínio pelas portas de entrada; o domínio, com entidades e casos de uso, usa portas de saída implementadas por adaptadores de banco (TypeORM e PostgreSQL), de autenticação (JWT) e presenters REST."
      width={800}
      height={440}
      groups={[
        { label: 'FRONTEND · VUE 3', x: 16, y: 16, w: 214, h: 408 },
        { label: 'API · NESTJS', x: 254, y: 16, w: 530, h: 408, note: 'Docker Compose: dev · prod · AWS' },
      ]}
      boxes={[
        { id: 'components', title: 'Componentes', sub: 'telas e formulários', x: 36, y: 56, w: 174, h: 54 },
        { id: 'fuc', title: 'Casos de uso', sub: 'RemoteLogin…', x: 36, y: 140, w: 174, h: 54 },
        { id: 'factories', title: 'Factories', sub: 'montam dependências', x: 36, y: 224, w: 174, h: 54 },
        { id: 'gateways', title: 'Gateways', sub: 'Axios · localStorage', x: 36, y: 308, w: 174, h: 54 },
        { id: 'controllers', title: 'Controllers', sub: 'REST + Swagger', x: 274, y: 92, w: 140, h: 54 },
        { id: 'google', title: 'Google OAuth', sub: 'Passport', x: 274, y: 184, w: 140, h: 54 },
        { id: 'jwt', title: 'Guard JWT', sub: 'rotas protegidas', x: 274, y: 276, w: 140, h: 54 },
        {
          id: 'domain',
          title: 'Domínio',
          lines: ['User · Company', 'JobOpportunity', 'Login · UpdateUser'],
          x: 446,
          y: 76,
          w: 160,
          h: 270,
          shape: 'hex',
          tone: 'accent',
        },
        { id: 'db', title: 'Banco', sub: 'TypeORM → Postgres', x: 636, y: 92, w: 136, h: 54, tone: 'data' },
        { id: 'auth', title: 'Autenticação', sub: 'emite JWT', x: 636, y: 184, w: 136, h: 54 },
        { id: 'presenters', title: 'Presenters', sub: 'resposta HTTP', x: 636, y: 276, w: 136, h: 54 },
      ]}
      arrows={[
        { from: 'components', to: 'fuc', fromSide: 'bottom', toSide: 'top' },
        { from: 'factories', to: 'fuc', fromSide: 'top', toSide: 'bottom', dashed: true },
        { from: 'factories', to: 'gateways', fromSide: 'bottom', toSide: 'top', dashed: true },
        { from: 'gateways', to: 'controllers', fromSide: 'right', toSide: 'left', label: 'HTTP' },
        { from: 'controllers', to: 'domain', fromSide: 'right', toSide: 'left', toOffset: -46 },
        { from: 'google', to: 'domain', fromSide: 'right', toSide: 'left' },
        { from: 'jwt', to: 'domain', fromSide: 'right', toSide: 'left', toOffset: 46 },
        { from: 'domain', to: 'db', fromSide: 'right', toSide: 'left', fromOffset: -46 },
        { from: 'domain', to: 'auth', fromSide: 'right', toSide: 'left' },
        { from: 'domain', to: 'presenters', fromSide: 'right', toSide: 'left', fromOffset: 46 },
      ]}
    />
  )
}
