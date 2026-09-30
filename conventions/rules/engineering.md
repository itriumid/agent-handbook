# Engineering conventions

Rules only. For *why* any of this is the way it is, see
[`../background/engineering.md`](../background/engineering.md).

## Update dependencies and runtime versions in small, regular batches

**Dependency and runtime version bumps happen in small, regular batches, not deferred into one
large jump.** A version bump is a normal pull request; letting the gap grow until it needs a
migration project is not the target state.

This is about keeping *existing* dependencies current — a different decision from adding a
*new* one, which still needs asking first (see [`ai-agents.md`](ai-agents.md)).

## Use explicit names, not abbreviations

**Names — files, directories, variables, functions, classes — spell out the full word instead
of abbreviating it.** `configuration` not `config`, `repository` not `repo`, `request` not
`req`. This binds AI agents the same as anyone writing code here.

Established terms of art that are already the primary name of a real technology or standard
stay as they are — `API`, `URL`, `HTTP`, `ID` — since spelling those out would itself be less
clear, not more. So do names a framework or tool dictates, like `tauri.conf.json` or
`vite.config.ts`.

## Write in American English

**Prose, comments and names use American spelling** — `color` not `colour`, `license` not
`licence`, `behavior` not `behaviour`. Proper names and names a tool or standard dictates stay
as they are.

## Build to level AA of the Web Content Accessibility Guidelines

**Every interface we make meets level AA of the Web Content Accessibility Guidelines (WCAG)
2.2**: our free applications, itrium.id and tools.itrium.id. Client work is built to level AA
too, unless the client decides otherwise in writing. Level AAA isn't the target; it rules out
too much, including a pastel palette like Rhodonite.

What that means in practice, and what a review checks:

- **Contrast:** 4.5:1 for text, 3:1 for large text, focus outlines, and anything that is the
  only way to see a control or its state. Check every surface text sits on, not only the page
  background. [`../reference/brand.md`](../reference/brand.md) has the numbers for our colors.
- **Color is never the only signal.** A state shown by color alone (selected, pressed, an
  error) also needs an edge, a shape, text or an icon that reaches 3:1.
- **Everything works with a keyboard**, in a sensible order, with a visible focus outline.
- **Controls have names.** Every button, field and image has a label or text alternative a
  screen reader can announce; icon-only buttons get an `aria-label`.
- **People's settings win.** Respect light and dark, reduced motion and larger text.

Where a check can run automatically, it runs in Continuous Integration: Honk's
`tests/contrast.test.mjs` is the model for colors.
