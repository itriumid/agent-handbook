# Scaffold

Files copied into each project. Unlike `conventions/`, these do **not** arrive by symlink — they
are copied, because checks run in a checkout that has no handbook next to it, and an entrypoint
file has to exist even when the handbook link is broken.

`common/` mirrors the destination layout, so installing is close to a straight copy:

```bash
cp -R ~/wherever/agent-handbook/scaffold/common/. path/to/project/
```

## What's here

| File | Notes |
|---|---|
| `AGENTS.md` | Entrypoint template. Repository-owned after copying; fill in its last section. |
| `CLAUDE.md` | Imports `AGENTS.md`, then adds the little that applies to Claude Code only. Needed because Claude Code reads `CLAUDE.md`, not `AGENTS.md`. |
| `.claude/settings.json` | Claude Code's shared project settings: default models, no attribution, and hard blocks behind a few rules. See **Claude Code settings** below. |
| `.github/workflows/pull-request-checks.yml` | The `Branch name` and `Commit messages` checks the ruleset requires. |
| `.github/workflows/label-sync.yml` | Provisions the standard label set. Manual dispatch only. |
| `.github/pull_request_template.md` | Applied automatically to every pull request. |
| `.github/ISSUE_TEMPLATE/` | The *Technical debt* form, plus its config. |

**Workflows under `scaffold/` never run.** GitHub Actions only reads `.github/workflows/` at the
repository root, so `scaffold/common/.github/workflows/*.yml` is inert here. That is intentional
— don't "fix" it by moving them.

**Scaffold Markdown is kept Prettier-formatted** (`prettier --check scaffold/common`), so copies
pass in projects that lint Markdown. Leave the YAML alone: its quote style depends on each
project's Prettier config, so no one formatting can satisfy all of them.

## Claude Code settings

`.claude/settings.json` is committed, so it applies to anyone who opens the project in Claude
Code. Like the workflows, it is meant to stay identical across repositories. It needs Claude Code
2.1.251 or newer: older versions put every subagent on the default subagent model and ignore a
per-task choice.

| Setting | What it does |
|---|---|
| `model` | New sessions start on the strongest model. |
| `env.CLAUDE_CODE_SUBAGENT_MODEL` | Subagents default to a lighter model. The session can still choose another model for one subagent — see `CLAUDE.md`. |
| `attribution` | Turns off the commit trailer and pull request footer, so **No self-attribution** holds without anyone remembering it. |
| `permissions.deny` | Blocks the agent from force-pushing, skipping hooks with `--no-verify`, writing through `.handbook/`, and reading `.env` files. |

**The model settings are defaults.** `/model` still switches the model for a session. Project
settings outrank personal ones, so a personal default is overridden in this project at every new
session; to keep a different one here, set `model` in `.claude/settings.local.json`, which
outranks the shared file and is not committed. A file created by hand needs adding to
`.gitignore`.

**The deny rules are not defaults.** No personal setting lifts them, and they bind the agent
only. A person can still run any of these commands in a terminal — which is where the
`git push --force-with-lease` after a rebase happens (see **Rebasing** in
`conventions/rules/branching.md`).

**They back the rules up; they don't replace them.** The patterns match the usual spellings of a
command, not every one: `git -C <path> push --force` or a combined short flag gets past them.
`conventions/rules/ai-agents.md` still applies to whatever they miss. `.env.example` stays
readable on purpose, so an agent can still learn which variables exist.

## Ownership after copying

**`AGENTS.md` becomes the repository's own file.** Copy it once, then edit it freely — it is
where repository-specific instructions belong. Nothing syncs it back. The shared content it
points at lives in `.handbook/`, which is why the template carries almost no conventions itself.

**The workflows, templates and settings are meant to stay identical** across repositories. If one
repository needs a different branch-name pattern, that is a signal the convention should change
here, not that the copy should diverge.

## Installing in a repository

1. Link the handbook: `scripts/link.sh path/to/project`.
2. On a branch — `chore/adopt-agent-handbook` — copy `common/` in, fill in the last section of
   `AGENTS.md`, and commit. If the project already has an `AGENTS.md` or `CLAUDE.md`, merge
   rather than overwrite.
3. Run `scripts/configure-repository.sh owner/project`. It applies the merge settings and the
   ruleset; the adoption pull request can still merge, because it carries the workflow the
   ruleset requires.
4. Open the pull request, and merge it once both checks are green.
5. Run `label-sync.yml` once, from the Actions tab. **Read its header first** — it deletes every
   label outside the standard set. Its `dry_run` input lists the changes without making them.
