# agent guidelines

## build & development

- **dev server**: `bun run dev` (next.js with turbo)
- **build**: `bun run build`
- **type check**: `bun run typecheck`
- **linting**: `bun run check`
- **auto-fix**: `bun run check:write` (safe) or `bun run check:unsafe` (includes unsafe fixes)
- **tests**: `bun test` (vitest with jsdom)
- **single test**: `bun test path/to/test.tsx`
- **tests ui**: `bun run test:ui`
- **database**: `bun run db:push` (sync schema), `bun run db:studio` (gui)

## code style

**imports**: organize using biome (auto-sorted). use path alias `@/*` for src directory.

**formatting**: double quotes, no semicolons, 2-space indentation (biome enforces).

**types**: typescript strict mode enabled. use `type` imports for types. avoid `any` (use `z.any()` only for zod).

**components**: functional react with hooks. client components use `"use client"`. props as interfaces with optional defaults. use `clsx`, `cva`, or `cn` for class merging (biome sorts classes). tailwind for styling.

**naming**: camelCase for functions/variables, PascalCase for components/types. schema suffixes: `*Schema` for zod validators.

**error handling**: use explicit error throwing with messages. server-side: zod validation + error throwing. no try-catch without logging context.

**trpc**: `createTRPCRouter`, `protectedProcedure` for auth-required endpoints. input validation with zod schemas.

**state**: zustand stores in `@/lib/stores/`. hook pattern: `use*Store((state) => state.*)`.

**testing**: vitest with react testing library. place tests in `__tests__` folders or `*.test.tsx` files. setup file: `vitest.setup.ts`.

**no comments** unless code logic is non-obvious.
