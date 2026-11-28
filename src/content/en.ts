// English texts. Content edits live here, next to the Russian ones.
import type { SiteContent } from './types';

export const en: SiteContent = {
  lang: 'en',
  meta: {
    title: 'site',
    owner: 'Nikita Makarichev',
    lead: 'Backend engineer on Go. Money engines, event-driven systems, tools I build for myself.',
    pages: {
      home: {
        title: 'Nikita Makarichev — Backend Engineer',
        description: 'Backend engineer on Go from Moscow: money engines, event-driven systems, and tools I build for myself.',
      },
      about: {
        title: 'Nikita Makarichev — about the site',
        description: 'How this site works: a static Astro build styled as a risograph zine, a project showcase and a resume page.',
      },
      cv: {
        title: 'Nikita Makarichev — Résumé',
        description: 'Five years of production Go: a bank, a marketplace, Sber — experience, numbers and stack, ready to print on A4.',
      },
      alpha: {
        title: 'alpha — risk gate and bet execution',
        description: 'Trading and betting engines in Go: one data bus, a risk gate with a proved core, and idempotent bet execution.',
      },
      hq: {
        title: 'hq — personal super-app',
        description: 'A personal super-app on one server and one database: SyncSource adapters, panels for everything.',
      },
      blog: {
        title: 'Nikita Makarichev — blog',
        description: 'Posts by date: notes and write-ups, tagged and marked with their language.',
      },
    },
    footer: 'print — risograph, build — astro',
    skip: 'skip to content',
    navAria: 'site sections',
    switchLabel: 'RU',
    switchAria: 'Переключиться на русский',
    nav: [
      { label: 'home', path: '/' },
      { label: 'alpha', path: '/projects/alpha' },
      { label: 'hq', path: '/projects/hq' },
      { label: 'blog', path: '/blog' },
      { label: 'resume', path: '/cv' },
      { label: 'about', path: '/about' },
    ],
  },

  home: {
    kicker: 'personal public site',
    h1given: 'Nikita',
    h1family: 'Makarichev',
    lead: 'Backend engineer on Go: the money path of event-driven systems, trading engines, tools I build for myself.',
    intro:
      'Five years of production Go: an order book and account sharding at a bank, the payment flow at a marketplace, event streaming at Sber. Now I am building my own projects: alpha — trading and betting engines, hq — a personal super-app. This site is their showcase, plus my resume.',
    status: 'project showcase',
    statusNote:
      'alpha and hq are working projects with open architecture; the resume lives as a page of this site.',
    chips: ['astro', 'github pages', 'risograph'],
    projectsTitle: 'projects',
    projects: [
      {
        kicker: 'money',
        title: 'alpha',
        line: 'Trading and betting engines in Go: one data bus, one risk gate, many strategies.',
        path: '/projects/alpha',
        cta: 'about alpha →',
      },
      {
        kicker: 'tools',
        title: 'hq',
        line: 'A personal super-app: notes, memory, skills, chats, tabs and entities from external services.',
        path: '/projects/hq',
        cta: 'about hq →',
      },
    ],
    cv: {
      kicker: 'experience',
      title: 'resume',
      line: 'Five years of production Go: a bank, a marketplace, Sber. Experience, numbers, stack — and an A4 print.',
      path: '/cv',
      cta: 'resume →',
    },
  },

  about: {
    kicker: 'about the site',
    title: 'about',
    paragraphs: [
      'This is a personal public site. Nothing private, no backend: just static files anyone can read and search engines can index.',
      'Built with Astro and styled as a risograph zine: paper ground, six spot inks, hard ink frames. Builds to static files and publishes on GitHub Pages.',
      'Here is the project showcase — alpha and hq with their architecture — and the resume as a site page with an A4 print. Every page has an English version. Texts live apart from the markup.',
    ],
    facts: [
      ['stack', 'Astro + TypeScript, static'],
      ['deploy', 'GitHub Actions → GitHub Pages'],
      ['style', 'PLAYERPRINT · risograph zine'],
      ['languages', 'русский, english'],
    ],
  },

  blog: {
    kicker: 'blog',
    title: 'blog',
    lead: 'Posts by date: topics are tagged, each post is marked with its language.',
    empty: 'nothing here yet',
    emptyNote: 'The first post is not written yet.',
    tagsLabel: 'tags',
    backToList: '← back to the list',
    tocTitle: 'contents',
    translationLabel: 'translation',
    feedLabel: 'rss',
    feedTitle: 'Blog — Nikita Makarichev',
    feedDescription: 'Notes on Go and my own projects: money engines, event-driven systems, and tools I build for myself.',
  },

  alpha: {
    kicker: 'project · money',
    title: 'alpha',
    tagline: 'Trading and betting engines in Go: one data bus, one risk gate, many strategies.',
    task: {
      title: 'the task',
      paragraphs: [
        'One Go monorepo for every money bot: one data bus, one risk gate, many strategies and executors. A new idea is one strategy file plus a feed adapter; nothing can bypass the risk gate and the journal.',
        'The launch ladder is fixed: paper on recorded data → 1 unit of real money → scale. The owner moves between rungs, by hand.',
      ],
    },
    architecture: {
      title: 'architecture',
      intro:
        'One data path for backtest and for live — a difference between the two is a bug, not a feature:',
      flowLabel: 'flow',
      flow: ['Feed', 'Store', 'Strategy', 'RiskGate', 'Executor', 'Journal'],
      layers: [
        {
          name: 'Feed',
          text: 'Adapters for external sources: bookmaker APIs, exchanges, scrapers. They only read the world and write raw events into the store — no decisions. Every external format is checked by a golden test on a recorded fixture.',
        },
        {
          name: 'Store',
          text: 'SQLite: time and events. Append and Replay(from, to) — the only package that knows about the database; migrations are files, applied at startup.',
        },
        {
          name: 'Strategy',
          text: 'A pure function (State, Event) → []Intent. No IO, no network, no time.Now(): time comes with the event. Strategy imports of the executor and transports are forbidden and checked by a test.',
        },
        {
          name: 'RiskGate',
          text: 'A separate process, talking to the engine over a local unix socket instead of a library call inside the strategy. Limits: max stake, daily stop-loss, market and strategy exposure, open position cap, a global kill switch. Any Intent can be vetoed.',
        },
        {
          name: 'Executor',
          text: 'The only place where a real action happens: a bet, an order. Idempotency lives in the database: an Intent carries a key, and a repeat with the same key never places a second bet or order.',
        },
        {
          name: 'Journal',
          text: 'Append-only JSONL with a hash chain: what we decided, what we sent, what the world answered. Rows are never updated or deleted; state is rebuilt by replaying the journal, deterministically.',
        },
      ],
    },
    stack: {
      title: 'stack',
      items: ['Go', 'SQLite', 'Bend — proofs', 'Unix socket', 'JSONL journal', 'Golden fixtures', 'Property tests'],
    },
    proven: {
      title: 'what is proved',
      items: [
        'The proved risk-gate kernel: the stake cap min(limit, bankroll/20) is computed by a kernel written in Bend, and two laws — the cap never exceeds the limit, the cap never exceeds the bankroll — are proved from bend-mathlib lemmas; the proofs run as a CI step.',
        'The kernel answers with the cap only: the allow/deny branch lives in Go and is covered by a property test — the proved kernel and the reference Go rule agree on hundreds of random triples.',
        'The rule invariants are checked on a grid: the answer is either 0 or the stake, and never more than the cap.',
        'Fail-closed: a crash, a timeout or a missing kernel binary means rejection, never a silent allow.',
        'Idempotency: a repeated Intent with the same key makes one executor call — checked by a test.',
        'Every limit: breach → Rejected{Reason}; kill switch → rejection without a panic.',
      ],
    },
    status: 'The risk gate is built: proved kernel, laws, property test, fail-closed. The remaining rungs are the next print runs.',
  },

  hq: {
    kicker: 'project · tools',
    title: 'hq',
    tagline: 'A personal super-app: one server, one database, panels for everything.',
    task: {
      title: 'the task',
      paragraphs: [
        'Notes, memory, skills, chats, tabs, bookmarks and saved entities from external services — YouTube, GitHub, Linear, email — in one application I use every day.',
        'The application changes constantly and has to stay stable, so the shape is strict: one deploy, one database, one language. No microservices.',
      ],
    },
    architecture: {
      title: 'architecture',
      intro: 'Data flows one way, and an external service enters the system through exactly one door:',
      flowLabel: 'flow',
      flow: ['SyncSource', 'SQLite', 'Express API', 'Panels'],
      layers: [
        {
          name: 'SyncSource',
          text: 'The only way to add an external service: a Pull(cursor) → Items adapter, plus a schema and a panel. A new service is a new adapter file and a fixture — not a new service and not a new repository.',
        },
        {
          name: 'Express + SQLite',
          text: 'One server: API, sync and scheduler; one database to start with. Schema migrations are files only, applied at startup, reversible.',
        },
        {
          name: 'Contract',
          text: 'Client types are derived from the server schema: an API drift breaks the build, instead of becoming a production bug.',
        },
        {
          name: 'Panels',
          text: 'A Vite and React client: CRM, projects, tasks, today, inbox, metrics. Mutations use optimistic versioning (expectedVersion) and an idempotency key.',
        },
      ],
    },
    stack: {
      title: 'stack',
      items: ['TypeScript', 'Node.js', 'Express', 'SQLite', 'React', 'Vite', 'Golden fixtures'],
    },
    proven: {
      title: 'what is proved',
      items: [
        'The client↔server contract is typed and generated from the schema: a shape drift breaks the build (tsc), instead of surfacing at runtime.',
        'Golden tests on external service parsers and on recorded API responses: a recorded response is the reference, and a parser drift shows up immediately.',
        'Migrations are reversible and applied at startup — a rollback needs no manual steps.',
        'Stability is enforced by rules: one deploy, one database, one language; secrets and captured sessions never reach git.',
      ],
    },
    status: 'The panel and server skeleton is up; the skeleton under the stability rules is the first iteration, panels and sync come next.',
  },

  cv: {
    kicker: 'resume, issue 2026',
    given: 'Nikita',
    family: 'Makarichev',
    role: 'Senior backend engineer, Go. The money path of event-driven systems, five years in.',
    contacts: [
      { label: 'Moscow, Fili', href: '' },
      { label: '+7 (985) 977-51-65', href: 'tel:+79859775165' },
      { label: 't.me/Grushor', href: 'https://t.me/Grushor' },
      { label: 'thegrushor@gmail.com', href: 'mailto:thegrushor@gmail.com' },
      { label: 'github.com/Gwushor', href: 'https://github.com/Gwushor' },
    ],
    navAria: 'resume sections',
    sectionNav: [
      { id: 'summary', label: 'Summary' },
      { id: 'numbers', label: 'Numbers' },
      { id: 'path', label: 'Path' },
      { id: 'experience', label: 'Experience' },
      { id: 'review', label: 'Review' },
      { id: 'open-source', label: 'Open source' },
      { id: 'skills', label: 'Skills' },
      { id: 'education', label: 'Education' },
      { id: 'fine-print', label: 'Fine print' },
    ],
    summary: {
      title: 'summary',
      leads: [
        'Five years of production Go on money systems: an order book and account sharding at a bank, the payment flow at a marketplace, event streaming at Sber. I designed the event-driven architecture of a banking service and led three engineers without the title.',
        'The focus: distributed event-driven systems and microservices in fintech and e-commerce — real-time command and event processing (Kafka, EventStoreDB), inter-service communication strategy.',
        'What I bring: production exactly-once event handling, a habit of designing for replay, and a matching engine at 76.6 ns per crossing order, about 13M orders a second on one core.',
      ],
    },
    numbers: {
      title: 'numbers I can show',
      items: [
        { value: '76.6', unit: 'ns', label: 'per crossing order, price-time priority', source: 'pit, BenchmarkSubmitCrossing' },
        { value: '≈13M', unit: 'ord/s', label: 'one core, a single writer, no locks on the hot path', source: 'pit' },
        { value: '1.67', unit: 'ms', label: 'journal replay of 20k events, deterministic', source: 'pit, BenchmarkReplay' },
        { value: '5', unit: 'yrs', label: 'production Go since 2021', source: 'NIFI, Black Wall, Kangaroo, Sber' },
        { value: '50+', unit: 'roles', label: 'granular permissions in a banking RBAC layer', source: 'Black Wall Group' },
        { value: '3', unit: 'people', label: 'stood in as team lead, no formal title', source: 'Kangaroo' },
      ],
    },
    path: { title: 'path' },
    experience: {
      title: 'experience',
      roles: [
        {
          title: 'Backend Engineer (Go)',
          company: 'Sber',
          place: 'Moscow',
          period: '04/2025 — 09/2026',
          blurb: 'The largest bank in Eastern Europe, 100M+ clients',
          stack: ['Go', 'Apache Kafka', 'gRPC', 'REST API', 'microservices', 'GigaChat API'],
          points: [
            'Microservices for real-time command and event processing in Go and Apache Kafka: eventual consistency, idempotent handling.',
            'A multi-threaded Kafka importer: grouping by topic and handler, message rollback, deduplication by event key — exactly-once, no losses, no duplicates.',
            'Integrated GigaChat, a large language model, into the bank’s closed perimeter: REST and gRPC wrapper, streamed responses, prompt pipeline — no data left the perimeter.',
            'The ecosystem integration layer: chats, tasks, GigaChat and internal services — heterogeneous vendor APIs behind one contract.',
            'Inter-service communication strategy and architecture design of the service.',
            'A task process for backend development, with separate strategies for services and libraries.',
          ],
        },
        {
          title: 'Backend Engineer (Go), Team Lead',
          company: 'Kangaroo',
          place: 'Moscow',
          period: '04/2024 — 04/2025',
          blurb: 'Retail and online store',
          stack: ['Go', 'PostgreSQL', 'WebSocket', 'Firebase', 'Stripe API'],
          points: [
            'Stood in as team lead for 3 backend engineers: task decomposition, onboarding, prioritisation, scope talks with product. No formal title, I took the role on my own initiative.',
            'The money cycle from cart to charge on Stripe: order state, payment statuses, idempotency on repeated provider callbacks.',
            'A user chat over WebSocket with Firebase notifications: one connection per client, delivery both ways without polling.',
            'A generator of API documentation and Postman collections from Go sources, so the docs always matched the code; released later as go-postman-66.',
            'Tree product categorisation of 40,000+ categories, listings and reviews with multilingual translation, and a seller dashboard.',
          ],
        },
        {
          title: 'Backend Engineer (Go)',
          company: 'Black Wall Group',
          place: 'Moscow',
          period: '07/2022 — 04/2024',
          blurb: 'IT and system integration, financial sector',
          stack: ['Go', 'PostgreSQL', 'Apache Kafka', 'EventStoreDB', 'Redis'],
          points: [
            'Designed the event-driven microservice architecture of a banking service: a money loop on Event Sourcing and eventual consistency.',
            'Client funds sharding: lower cost per transaction, less damage when part of the accounts goes unavailable (design stage, the project was shelved).',
            'Role-based API access control with granular permissions for 50+ roles.',
            'Three-way currency exchange with a multi-level rate system and dynamic pricing.',
            'An automatic order book for exchange orders on EventStoreDB: state rebuilt by replaying the journal, not by snapshotting tables.',
            'A PostgreSQL transaction propagation tool that removed database deadlocks and gave the application transactional safety.',
            'A reusable domain logic library of DDD primitives: shared money, identifier and event types instead of copies in every service.',
            'Introduced blue-green deployment: updates without downtime.',
          ],
        },
        {
          title: 'Programmer',
          company: 'NIFI',
          place: 'Moscow',
          period: '09/2021 — 07/2022',
          blurb: 'Financial Research Institute of the Russian Ministry of Finance',
          stack: ['Go', 'React.js', 'Python', 'NumPy'],
          points: [
            'Web dashboards in Go and React.js; statistical and financial data analysis in Python and NumPy.',
            'Web parsers and scrapers, text sentiment processing (NLP) from external sources.',
          ],
        },
      ],
    },
    review: {
      title: 'code review and mentoring',
      kicker: 'across all projects, since 2021',
      paragraphs: [
        'Technology deep-dives for colleagues with diagrams and worked examples — the same format for developers outside the company.',
        'Detailed code review and pair programming; technical interviews for backend candidates.',
      ],
    },
    openSource: {
      title: 'open source',
      repos: [
        {
          name: 'pit',
          desc: 'A deterministic matching engine (Central Limit Order Book) in Go: price-time priority, an event-sourced journal with exact replay. Benchmarks: 76.6 ns per crossing order, about 13M orders a second on one core; 1.67 ms to replay 20k events.',
        },
        {
          name: 'atlas',
          href: 'https://github.com/Gwushor/atlas',
          desc: 'A personal project board and agent delegation orchestrator: Rust and axum backend, xterm.js panel, a self-driving worker loop.',
        },
        {
          name: 'bqnlsp',
          href: 'https://github.com/Gwushor/bqnlsp',
          desc: 'A language server for BQN: interprocedural shape and type inference, semantic tokens, a Zed extension, a CLI mode for CI. Golden files checked against CBQN.',
        },
        {
          name: 'go-postman-66',
          href: 'https://github.com/Gwushor/go-postman-66',
          desc: 'A generator of documentation and Postman collections from Go sources; the codegen I first built for the Kangaroo backend.',
        },
        {
          name: 'jobwatch',
          href: 'https://github.com/Gwushor/jobwatch',
          desc: 'A job-hunting daemon: a vacancy aggregator, a filter on a local LLM, an agent that parses postings into Telegram cards.',
        },
        {
          name: 'localmix',
          href: 'https://github.com/Gwushor/localmix',
          desc: 'A local LLM inference stack on llama.cpp: three models, a CLI, no cloud.',
        },
      ],
    },
    skills: {
      title: 'skills',
      groups: [
        { label: 'Languages', items: ['Go (primary)', 'SQL', 'Python for data analysis', 'Rust (pet projects)'] },
        { label: 'Data and transport', items: ['PostgreSQL', 'Redis', 'EventStoreDB', 'MongoDB', 'Apache Kafka', 'gRPC', 'REST API', 'WebSocket'] },
        { label: 'Infrastructure', items: ['Docker', 'Kubernetes', 'Linux', 'systemd', 'Git'] },
        { label: 'Observability', items: ['OpenTelemetry', 'Jaeger', 'Vector'] },
        { label: 'LLM integration', items: ['OpenAI-compatible API', 'llama.cpp', 'headless agents', 'prompt pipelines'] },
        { label: 'Systems programming', items: ['content-addressed storage', 'applied cryptography', 'git plumbing', 'Telegram Bot API'] },
        { label: 'Language tooling', items: ['LSP', 'interprocedural static analysis', 'editor extensions (Zed)'] },
        { label: 'Architecture and practices', items: ['microservices', 'event-driven architecture', 'Event Sourcing', 'CQRS', 'DDD', 'SOLID', 'deterministic replay', 'unit, fuzz and property-based tests', 'benchmarks'] },
      ],
    },
    education: {
      title: 'education and languages',
      educationTitle: 'Education',
      entries: [
        { school: 'Moscow Polytechnic University', degree: 'BSc, Information Technology (Big Data)', year: '2022' },
        { school: 'College of Informatics and Programming at the Financial Academy', degree: 'Vocational degree, Computer Systems Programming', year: '2019' },
      ],
      languagesTitle: 'Languages',
      languages: [
        { name: 'Russian', level: 'Native' },
        { name: 'English', level: 'C1, advanced' },
      ],
    },
    finePrint: {
      title: 'fine print',
      items: [
        'Citizenship: Russia, work permit in Russia.',
        'Open to relocation and to business trips.',
        'Full-time; on-site at the employer or remote.',
      ],
    },
    tools: {
      night: 'Night print',
      print: 'Save as PDF',
      railNote: 'Tab walks the page, the links on the left jump between sections. The print button opens the Save as PDF dialog — the resume is laid out for A4.',
    },
    printTitle: 'Nikita Makarichev — resume',
  },
};
