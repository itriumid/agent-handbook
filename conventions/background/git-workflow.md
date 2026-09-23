# Why the git conventions are what they are

**Skip this unless you're changing a rule.** Nothing here is instructions — it is the record
of decisions already made, kept so they aren't relitigated and so any proposed change knows
what the current rule was protecting against.

The rules themselves are in [`../rules/`](../rules/).

## Why one mainline and no promotion flow

A multi-environment flow — `development` → `staging` → `release` → `main`, with every change
promoted through each in turn — earns its cost when separate people own separate environments:
QA verifying on staging, beta users on a release channel. Its price is long-lived branches that
drift from each other, promotion pull requests, periodic resets, and a rulebook for the
exceptions.

Personal projects have none of the owners that justify it. Every extra long-lived branch would
be drift with no one on the other side of it. `main` is the only branch that lasts, a pull
request is the only way onto it, and anything that needs a preview gets it from the pull
request itself (a preview deploy, a local build) rather than from a branch.

**Revisit this if a project gains a real second audience for pre-release builds** — at that
point one `release` branch is worth pricing again, but not the whole flow by default.

## Why pull requests when working alone

With nobody to review, a pull request can look like ceremony. It isn't, for three reasons:

- **Checks run before `main` changes**, not after. A red check on a branch costs nothing; a red
  check on `main` of a project that deploys from `main` is an outage.
- **The title and description become the merge commit**, so every change arrives with a
  written why — which is what `git log --first-parent main` reads back as a changelog.
- **AI agents work with the owner's credentials.** A ruleset that requires a pull request is the
  one guardrail that holds even when an agent ignores its instructions — an agent can open a
  pull request, but nothing lands without the merge button.

## Why the ruleset has no bypass list

A bypass for the owner is a bypass for every tool running with the owner's token. The rule
exists precisely for the case where something pushes that shouldn't have, so it can't have an
exception for the credential that something would use.

## Public repositories

Most of these repositories are public, and GitHub gives public repositories on the Free plan
what it withholds from private ones:

| Capability | Public repository | Private repository on Free |
|---|---|---|
| Rulesets and branch protection | Yes | No |
| Actions minutes | Unlimited on standard runners | Capped per month |

That is why the rules here lean on enforcement rather than discipline: the enforcement is free.
A private repository gets the same settings but not the ruleset — `configure-repository.sh`
reports that rather than failing.

*These gates change over time — re-check against GitHub's current plan comparison rather than
trusting this table indefinitely.*

## Why the branch vocabulary is only four types

`docs`, `refactor`, `test` and `perf` fold into `chore` because **a short vocabulary that gets
applied consistently beats a precise one that doesn't.**

**Urgency is orthogonal to change type**, and often only becomes apparent once a pull request
is already open. A change doesn't stop being a feature because it got urgent. So it belongs on
a label, which can be added later, not in a branch name, which can't be changed without
breaking open pull requests.

### `feature` vs `enhancement`

The boundary that's easy to argue about. The test: *could a user have done this at all
before?* If no, `feature`. If they could but it was slower, clunkier or more limited,
`enhancement`. Both are user-visible and both appear in release notes — the split is about
novelty, not importance.

## Why lowercase slugs

- Git branch names are case-sensitive in commands — `git checkout fix/Null-Total` fails if the
  branch is `fix/null-total`. Predictable casing means no guessing.
- macOS and Windows have case-insensitive filesystems but git treats refs as case-sensitive.
  Two branches differing only in case can produce ref-lock errors on fetch.
- Anything deriving names from branches — preview deploy URLs, Docker tags — is lowercase-only
  and sanitizes silently.

## Why the issue number is bare digits

With GitHub Issues as the only tracker, a prefix like `GHI-` distinguishes nothing — there is
no second tracker to tell it apart from. `#12` is out because `#` is a URL fragment delimiter:
branch names in check links and preview URLs get truncated at it, and it needs shell quoting.

## Why the issue number is optional

Solo work often has no issue behind it, and opening one just to name a branch is ceremony. A
slug alone identifies the branch fine. But a branch with neither is one nobody can identify, so
one of the two is required.

## Why merge commits are the only merge method

With one mainline, squash merging would no longer cause the duplicate-changes problem it causes
in a promotion flow — so this is a choice, not a necessity. It is made to keep atomic commits:

- **Squash** collapses every commit on the branch into one, so the effort of making each commit
  a reviewable change is thrown away at merge time.
- **Rebase merge** keeps the commits but drops the grouping — `main` becomes a flat list with
  nothing recording which commits arrived together or why.
- **Merge commit** keeps both: the individual commits, and a merge commit carrying the pull
  request title and description. `git log --first-parent main` is the changelog; plain
  `git log` is the detail.

**This is also why individual commits have to be legible on their own.** A project that
squash-merges can let branch history be messy, because it collapses regardless. Here, a "wip"
or "address review comments" commit is permanent history. See **Commits** in
[`../rules/pull-requests.md`](../rules/pull-requests.md).

**Why the merge-commit message setting matters.** Without *Pull request title and description*,
GitHub generates `Merge pull request #123 from owner/feature/12-oauth` — noise.

## Why head branches are deleted automatically

In a promotion flow a branch merges several times, so deleting it after the first merge orphans
the rest. With a single merge into `main`, the branch is finished the moment it lands, and
leaving it around only clutters the branch list. Deleted branches can be restored from the
pull request page if ever needed.

## Why rebase locally but merge on the way in

Merging `main` into a working branch produces the tangled history that rebasing exists to
prevent, and it pollutes the pull request diff with unrelated commits.

The two rules are orthogonal, which is the part that confuses people: `pull.rebase` governs how
*you update your own branch*; merge commits govern *how pull requests land on `main`*.

**The GitHub UI has its own version of this trap.** A stale pull request shows an "Update
branch" button, and its default action merges `main` into the branch — the exact thing the rule
forbids, done by a button.

## Why `fix/` maps to `type: bug`

Branch prefixes describe the work; labels describe the outcome for release notes. They are
decoupled on purpose, and the names differ deliberately — recorded so nobody "fixes" the
mismatch later.

## Why `type: chore` exists even though chores don't ship in release notes

Without it a chore pull request carries no `type:` label, which is indistinguishable from a pull
request that was never labelled. It also puts *chore* where it's visible, which matters given
that `chore` absorbs refactors.

## Why draft pull requests instead of `[WIP]`

The title becomes the merge commit subject, so a forgotten `[WIP]` lands in permanent history.
Beyond that, draft is a state GitHub enforces, where a title string is a convention that has to
be read carefully:

| | Draft pull request | `[WIP]` in title |
|---|---|---|
| Merge button | Disabled | Works fine |
| Notifies watchers when ready | Yes, on "Ready for review" | No |

## Why the branch-name check reads the head ref from the API

Renaming a branch retargets its open pull requests but fires no webhook, so re-running the
workflow is the only trigger available — and a re-run replays the original event payload, in
which `head.ref` is still the old name. Reading it from `pulls.get` is what makes "rename the
branch" advice actually work.

## Why self-attribution is checked in CI, not just written down

Several AI tools add a `Co-Authored-By:` trailer or a "Generated with" line by default, and an
agent that misses or forgets the rule reproduces its tool's default. Prose rules are followed
most of the time; a required check is followed all of the time. This is the rule most likely to
be broken by default rather than by decision, so it's the one enforced.

The check reads the pull request title and description as well as every commit, because the
title and description become the merge commit.

**It will occasionally flag a legitimate mention** — a pull request that genuinely integrates a
vendor's API, say. That's accepted: rewording "Add Claude API client" to "Add LLM API client" is
cheap, and a check with an escape hatch is one that the next agent learns to use. Filenames a
tool dictates (`CLAUDE.md`, `AGENTS.md`) are stripped before matching, and a human co-author
trailer passes.

## Why the checks also run on every push

They're required status checks, and required checks attach to a commit, not to a pull request.
If they only ran when the pull request opened, the first push after that would produce a new
head commit with no checks on it — and the ruleset would block the merge waiting for checks that
never come. `edited` is in the trigger list too, so fixing the title or description re-runs the
attribution check.
