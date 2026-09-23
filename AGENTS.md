# Working on this handbook

This repository is the source of truth for the conventions in every one of my personal
projects. Editing it changes how every project is worked on, immediately — there is no version
pinning and no per-repository pull request. Treat every change as having that blast radius.

## Hard rules

- **Never push to `main`.** Every change goes through a pull request, including typo fixes.
- **Never refer to yourself, your vendor, or your model** in commits, pull request text, or
  file content here — the same rule this handbook sets for every other repository. See
  `conventions/rules/ai-agents.md`.
- **Follow the conventions defined here** when working in this repository. Branch names, pull
  request titles and merge method are all specified in `conventions/rules/`. Read them rather
  than guessing; a handbook that violates its own rules is worse than no handbook.
- **Do not add repository-specific content.** If it only applies to one codebase, it goes in
  that codebase. That includes build commands, known issues, and which checks a given
  repository runs.
- **Do not add project state** — action items, rollout checklists, TODOs, open questions.
  Those belong in the issue tracker. An agent reading unchecked boxes here may act on them.

## Which directory content goes in

| Directory | Holds | Test |
|---|---|---|
| `conventions/rules/` | operative rules | Does it tell someone what to do? |
| `conventions/reference/` | lookup material | Do you consult it while doing one task? |
| `conventions/background/` | rationale | Is it explaining *why* a rule exists? |
| `decisions/` | cross-project technology and infrastructure decisions | Would getting this wrong affect more than one project? |
| `scaffold/` | files copied into other repositories | Does it get copied out of here? |
| `scripts/` | tooling run from here | Does it run from this repository rather than get read or copied out of it? |

Getting this wrong has a specific cost, so it is worth being careful about:

**Rules are bare imperatives, with the argument stripped out.** Write "slugs are lowercase
kebab-case", not "slugs are lowercase because git refs are case-sensitive". Rationale inside a
rule invites the reader to decide whether the rule applies to them — which is exactly the
behaviour a rule exists to prevent. Put the argument in `conventions/background/` and let the
rule stand bare.

**Background is explicitly skippable.** Do not put anything load-bearing there. If an agent
skipping it would behave incorrectly, it is a rule and it is in the wrong directory.

## When editing a rule or a decision

1. Read `conventions/background/` for that topic first. The rule may already be the considered
   outcome of the argument being reopened.
2. Say so if it is. "This was decided deliberately, here's why" is more useful than a
   compliant edit that loses the reason.
3. If the reasoning changed, update `background/` in the same pull request as the rule, so the
   record never describes a rule that no longer exists.
4. Label the pull request `area: rules` or `area: decisions`.

For `decisions/`, check whether an existing file already covers the ground first. If the new
one supersedes it, say so in both files rather than editing the old one into something else —
see `decisions/README.md`.

## Labels

This repository uses its own `area:` set rather than the `type:` labels defined for code
repositories — nothing here ships, so every change would otherwise be `type: chore`. Full list
in `conventions/reference/labels.md`.
