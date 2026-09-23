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
| `CLAUDE.md` | Imports `AGENTS.md`. Needed because Claude Code reads `CLAUDE.md`, not `AGENTS.md`. |
| `.github/workflows/pull-request-checks.yml` | The `Branch name` and `Commit messages` checks the ruleset requires. |
| `.github/workflows/label-sync.yml` | Provisions the standard label set. Manual dispatch only. |
| `.github/pull_request_template.md` | Applied automatically to every pull request. |
| `.github/ISSUE_TEMPLATE/` | The *Technical debt* form, plus its config. |

**Workflows under `scaffold/` never run.** GitHub Actions only reads `.github/workflows/` at the
repository root, so `scaffold/common/.github/workflows/*.yml` is inert here. That is intentional
— don't "fix" it by moving them.

## Ownership after copying

**`AGENTS.md` becomes the repository's own file.** Copy it once, then edit it freely — it is
where repository-specific instructions belong. Nothing syncs it back. The shared content it
points at lives in `.handbook/`, which is why the template carries almost no conventions itself.

**The workflows and templates are meant to stay identical** across repositories. If one
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
