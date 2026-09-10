<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## WordPress GraphQL API Integration Guidelines

- **Endpoint:** `NEXT_PUBLIC_WORDPRESS_API_URL` (`https://api.bnp-coorporation.com/graphql`)
- **Schema File:** `schema.graphql` at project root contains the introspected GraphQL schema from WordPress.
- **Typescript Types:** `src/types/wordpress.d.ts` contains automatically generated TypeScript types for all WP GraphQL entities.
- **Fetching:** Always use `fetchAPI` from `@/lib/wp-graphql` and modular queries in `@/lib/api`.
- **Regenerate Schema:** Run `npm run generate-types` whenever WordPress Custom Post Types or ACF fields are modified.

