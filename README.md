# Agent Handbook

The conventions for [Itrium](https://github.com/itriumid)'s projects: followed by every AI
coding agent that works on them, and by everyone else who does too. Rules, the reasoning behind
them, cross-project decisions, and the scaffolding each repository copies in. They're written
for how Itrium works, not as general advice. One source of truth, read directly by whatever agent is working in a project, and
by me when a rule needs changing.

Nothing here is repository-specific. If a rule or a decision only makes sense in one codebase,
it belongs in that codebase instead.

## Layout

| Path | What it is | Who reads it |
|---|---|---|
| `conventions/rules/` | Operative rules. Imperative, no argument. Includes what AI agents may write and do. | constantly |
| `conventions/reference/` | Lookup material — label tables, procedures. | on demand |
| `conventions/background/` | Why the rules are what they are. | only when changing a rule |
| `decisions/` | Technology and infrastructure choices that affect more than one project. | when it matters, or before proposing a new one |
| `scaffold/` | Files copied into other repositories. | once, at repository setup |
| `scripts/` | Tooling that runs against this repository or configures another one — not copied elsewhere. | when setting up a repository |
| `.github/` | This repository's own checks and pull request template — not copied elsewhere; that's `scaffold/common/.github/`. | GitHub, on every pull request here |

The split between the three `conventions/` directories is deliberate and load-bearing —
see [Writing for this handbook](#writing-for-this-handbook).

## Setup

Every repository reaches the handbook through a local symlink named `.handbook`, pointing at
this repository's root. The link is machine-local — gitignored, not committed — since where
this repository is cloned is a property of the machine, not of the project.

Clone this repository anywhere, then run `scripts/link.sh` against the repository to link —
either pointing at it from here, or with no argument from inside it:

```bash
~/wherever/agent-handbook/scripts/link.sh path/to/project
```

Verify it resolved — this should print the rules, not an error:

```bash
ls path/to/project/.handbook/conventions/rules/
```

Re-run the script any time the link looks wrong — after moving either repository, or on a
fresh clone. It force-overwrites whatever `.handbook` pointed at before.

**If `.handbook/` is missing or dangling**, fix it before trusting anything an agent says about
these conventions — a broken link reads as "no conventions exist", silently.

Then copy the scaffold in and configure the repository on GitHub — see
[`scaffold/README.md`](scaffold/README.md).

## How changes reach every project

Instantly. Every `.handbook` points at the same local clone, so `git pull` here updates every
project on the machine at once. Nothing is copied, vendored, or pinned.

That is the point, and it is also the risk: **merging here changes how every project is worked
on, immediately.**

## Governance

**Every change goes through a pull request**, including typo fixes. This repository follows
the branch naming and pull request conventions it defines, and a ruleset on `main` enforces
it — see `scripts/configure-repository.sh`.

**Before changing anything under `conventions/rules/` or `decisions/`, read the matching
`background/` file.** The current rule is usually the considered outcome of the argument about
to be reopened. Label those pull requests `area: rules` or `area: decisions`.

## Writing for this handbook

The three-way split exists because rules and rationale want different readers, and mixing
them makes both worse.

**Rules are bare imperatives.** "Slugs are lowercase kebab-case." Not "slugs are lowercase
because git refs are case-sensitive and preview URLs sanitize silently." The second invites a
reader — human or agent — to reason about whether the rule applies to their case, which is how
a settled decision gets relitigated. State the rule; put the argument in `background/`.

**Reference is lookup, not instruction.** Tables and procedures consulted while doing one
specific thing. It is authoritative, but it does not tell you what to do.

**Background is skippable by design.** It exists so a settled argument stays settled, and so
that changing a rule starts from knowing what the rule was protecting against.

Two things that do **not** belong here at all:

- **Repository-specific detail.** Build commands, known issues, which checks a project runs.
  Those live in that repository's `AGENTS.md`.
- **Project state.** Action items, rollout checklists, open questions. An agent reading a
  handbook full of unchecked boxes may well try to complete them. Use the issue tracker.

## License

[MIT](LICENSE)
