# Itrium's engineering conventions

Rules only, and only for Itrium's own projects. They add to
[`../conventions/rules/engineering.md`](../conventions/rules/engineering.md), which applies to
every project.

## Write in American English

**Prose, comments and names use American spelling** — `color` not `colour`, `license` not
`licence`, `behavior` not `behaviour`. Proper names and names a tool or standard dictates stay
as they are.

## Which interfaces meet level AA

**The level AA rule in `conventions/rules/engineering.md` covers our free applications,
itrium.id and tools.itrium.id. Client work is built to level AA too, unless the client decides
otherwise in writing.**

- [`brand.md`](brand.md) has the contrast numbers for our colors. Rhodonite is a pastel palette,
  which is why level AAA isn't the target.
- Honk's `tests/contrast.test.mjs` is the model for a color check that runs in Continuous
  Integration.
