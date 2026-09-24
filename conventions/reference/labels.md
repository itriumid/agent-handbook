# Labels

Canonical label sets. `label-sync.yml` implements them and **deletes every label outside the
set**, so these tables are the source of truth and the workflows are derived from them. Update
this file first.

Palette is [Catppuccin Mocha](https://catppuccin.com/palette), except the two `status:`
labels, which use the brand colours.

## Code repositories

A pull request carries one `type:` and zero or more `status:` labels.

### `type:` — what the change is

| Label | Colour | Maps to | Notes |
|---|---|---|---|
| `type: feature` | `a6e3a1` Green | `feature/` | |
| `type: enhancement` | `94e2d5` Teal | `enhancement/` | |
| `type: bug` | `f38ba8` Red | `fix/` | The names differ deliberately |
| `type: chore` | `fab387` Peach | `chore/` | Excluded from release notes |

One label per branch prefix, mapping 1:1 — so there is never a judgement call at labelling
time.

### `status:` — anything blocking the merge

| Label | Colour | Use |
|---|---|---|
| `status: blocked` | `2B2B2B` graphite | Work is done but waiting on something external |
| `status: do-not-merge` | `FEBFCA` pastel pink | Deliberately not merging — spike, discussion, or ordering dependency |

There is no `wip` label — draft pull requests cover it, and GitHub enforces draft state.

**Dependabot** labels its pull requests `dependencies` by default, which `label-sync.yml` would
then delete. A repository that enables Dependabot sets `labels: ["type: chore"]` in
`dependabot.yml` instead.

## This handbook

The handbook uses its own set. Nothing here ships, so every change would otherwise be
`type: chore` — a column that is the same on every row tells a reader nothing.

| Label | Colour | Use |
|---|---|---|
| `area: rules` | `f5c2e7` Pink | A behavioural rule changed. Read the matching background first. |
| `area: decisions` | `74c7ec` Sapphire | A cross-project decision was added or changed. |
| `area: reference` | `f2cdcd` Flamingo | Lookup tables and procedures. No behaviour change. |
| `area: background` | `f5e0dc` Rosewater | Rationale and decision log. Skippable, not instructions. |
| `area: scaffold` | `89b4fa` Blue | Files copied into other repositories. |
| `area: tooling` | `b4befe` Lavender | `scripts/` and this repository's own `.github/`. |
| `status: blocked` | `2B2B2B` graphite | As above |
| `status: do-not-merge` | `FEBFCA` pastel pink | As above |

The three content layers (`rules`, `reference`, `background`) descend in saturation as they get
less load-bearing, so a long pull request list sorts visually by weight. `area: decisions` sits
at the same weight as `area: rules`. `area: scaffold` and `area: tooling` sit outside that ramp
on purpose — they are a different kind of change.

## Brand colours

The `status:` labels use graphite `#2B2B2B` and pastel pink `#FEBFCA`. The full palette and how
to use it are in [`brand.md`](brand.md).

## One thing to watch on release notes

GitHub's auto-generated release notes group by label, and a pull request matches only the
**first** category listed in `release.yml`. Put the `type:` categories first.

**`type: chore` belongs in `exclude.labels`, not in a category.** Excluding it drops the pull
request from the notes entirely, which is what "wouldn't appear in release notes if it shipped
alone" means. Left in as a category, every dependency bump shows up in the notes.

Label descriptions must stay under GitHub's 100-character cap.
