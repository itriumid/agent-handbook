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
