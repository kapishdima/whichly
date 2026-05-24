# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

**Optio** — инструмент для агентств и фрилансеров, который позволяет показывать клиенту несколько вариантов блоков сайта прямо на живом staging-окружении.

### Как работает

1. Разработчик пишет варианты блока в коде.
2. Клиент открывает staging-ссылку с токеном.
3. Клиент переключает варианты live на реальной странице.
4. Клиент оставляет выбор и комментарии.
5. Разработчик видит фидбек в дашборде.

### Ниша

Pre-launch ревью вариантов на реальном задеплоенном сайте.

Это **не**:
- Figma — варианты живут в реальном коде и реальном окружении, а не в макетах.
- A/B testing — цель не статистика на трафике, а согласование с конкретным клиентом до запуска.
- CodePen / песочница — варианты показываются в контексте настоящего сайта, со всем его стилем, данными и интеграциями.

## Структура монорепо

```
optio/
├── apps/
│   ├── web/                  # Next.js, optio.dev (лендинг)
│   ├── docs/                 # Fumadocs, docs.optio.dev
│   └── dashboard/            # Next.js + API + Prisma, app.optio.dev
│       ├── prisma/schema.prisma
│       └── app/api/...       # route handlers, Zod-схемы
├── packages/
│   ├── runtime/              # Vite lib → dist/optio.js (Preact + Shadow DOM, IIFE)
│   ├── react/                # @optio/react, tsup → ESM+CJS+dts
│   └── ui/                   # shadcn/ui + общий Tailwind preset
├── .nvmrc                    # 24
├── biome.json
├── package.json              # packageManager: pnpm@9, engines: node 24
├── pnpm-workspace.yaml
├── portless.json             # dev-only: https://*.optio.localhost
└── tsconfig.base.json        # strict, moduleResolution: Bundler
```

### Фиксированные решения

- **Apps**: три отдельных Next.js приложения, у каждого свой деплой и свой сабдомен.
- **Prisma**: схема и клиент живут в `apps/dashboard/prisma/`. БД использует только dashboard (включая API, к которому ходит runtime). Выносить в `packages/db` — когда появится второй потребитель.
- **Auth**: better-auth + Prisma adapter. Таблицы users/sessions живут в схеме dashboard.
- **Postgres**: self-hosted в Coolify, тот же VPS.
- **API типы**: единый источник — Zod-схемы в dashboard. Runtime импортирует только типы через tsconfig path (зависимости остаются standalone в рантайме).
- **CDN runtime**: Coolify Nginx, одна точка входа `https://cdn.optio.dev/optio.js`. На PoC версионирования нет; добавим, когда появятся реальные клиенты.
- **Build orchestration**: голый `pnpm -r --filter ...`. Turbo не вводим до первой реальной боли с CI.
- **Dev URLs**: локально все app поднимаются через **Portless** под HTTPS-сабдоменами, зеркальными проду: `https://optio.localhost` (web), `https://app.optio.localhost` (dashboard), `https://docs.optio.localhost` (docs). Конфиг — `portless.json` в корне. Portless в проде не используется.

### Стек по умолчанию

- **Node** 24 LTS (`.nvmrc` + `engines`) — нужно для Portless
- **Portless** для dev (`pnpm dev` = `portless`)
- **pnpm** 9.x (`packageManager` в корне)
- **TypeScript** 5.x, `strict: true`, `moduleResolution: "Bundler"`
- **Lint/format**: Biome (одна тулза)
- **Tailwind v4** (CSS-config). Общий preset экспортируется из `packages/ui`.
- **shadcn/ui** установлен в `packages/ui` (`components.json` там). Apps импортируют как `@optio/ui/components/<name>`.
- **@optio/react** — билд через **tsup** (ESM + CJS + .d.ts).
- **packages/runtime** — билд через **Vite lib mode**, IIFE-бандл.
- **Tests, Husky, commitlint, CI**: не на PoC.
