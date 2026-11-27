# Pull requests

Rules only. The label tables are in [`../reference/labels.md`](../reference/labels.md);
rationale is in [`../background/git-workflow.md`](../background/git-workflow.md).

## Titles

Every pull request lands as a merge commit with the pull request title as its subject, so
**your title is the git history**, not decoration.

```
Refresh token on 401 instead of logging out
Guard worker against unbounded queue growth
```

- Imperative mood — "Add", not "Added" or "Adds"
- No issue ref — that goes in the body as `Closes #12`
- No trailing period
- ~70 characters

**No `feat:`/`fix:` prefixes.** Release-note grouping comes from labels, not title parsing.

## Commits

**Each commit is one reviewable change.** Nothing is squashed on the way in — see **Merging** in
[`branching.md`](branching.md) — so whatever you commit lands on `main` exactly as written,
permanently.

- One logical change per commit. Its diff should stand on its own.
- Imperative mood, same as pull request titles: "Add", not "Added" or "Adds".
- No self-attribution in the message — see [`ai-agents.md`](ai-agents.md). That rule covers
  every commit, not just the pull request title.
- Write the body for a reader who wasn't there — see **Write for a reader who wasn't there**
  below.
- A review-feedback or bug-fix commit gets a real, descriptive message — never "address review
  comments" or "fix" — since it lands in history exactly as written.

## Descriptions

The repository template is applied automatically. Fill it in; don't replace it.

- **Why**, **What changed**, **How to verify** — every pull request, even a one-line chore.
- **Write `Closes #12`** under Why when the pull request resolves an issue. Nothing else
  auto-closes it.

### Write for a reader who wasn't there

The description becomes the body of the merge commit, and the people who read it later never saw
the request, the chat or the session that produced the change. The same goes for the body of a
commit message.

- **No "you", "I" or "we" for the people behind the change.** Say what was decided: "Backups
  are scrambled by default, with an optional passphrase", not "You chose scrambled by
  default". Say what was checked: "Ran the job's commands against Postgres 16", not "I ran".
  "You" for the product's users, or inside quoted interface text, is fine.
- **The Why is the problem, not the request.** "You asked for a bolder light mode" is not a
  reason; say what was wrong. When a person's decision is the reason, name their role and give
  their reason.
- **Describe the change, not the session.** Leave out the order the work happened in, scores
  from the run, and "the highest so far". Keep a rejected alternative only when it explains the
  result.
- **What must happen before merging is a step under How to verify**, or a comment on the pull
  request when it is an operational step such as renaming a deployment. Not a "worth knowing
  before merging" paragraph: it goes stale at merge and stays in history.
- **No open checkboxes or "To do" lists.** Write each item as a step under How to verify, or
  as a comment when it is an operational step. An unticked box stays unticked in history, and
  the next agent may act on it.

The **Commit messages** check fails a description with a missing or empty heading, and the most
common reply phrasings in descriptions and commit messages. It is deliberately narrow: passing
it does not mean the rule is met.

**Why.** A description written as a reply only makes sense to the person it replied to. Anyone
reading `git log` later gets "you chose" with no way to find out who chose, or why.

## Work in progress

**Use draft pull requests. Never put `[WIP]` in the title.** The title becomes the merge commit
subject, so a forgotten `[WIP]` lands in permanent history.

| What you mean | Use |
|---|---|
| "Not ready yet, still building" | Draft |
| "Done, but blocked on something external" | `status: blocked` |
| "Never merging, just for discussion or a spike" | Draft + `status: do-not-merge` |

There is no `wip` label. Draft state already expresses it and GitHub enforces it.

## Review

**No approval is required. Checks are the gate.** Read your own diff on the pull request before
merging — the diff view catches what the editor didn't.

**Assign yourself when you open a pull request.** GitHub does not do this automatically, and an
unassigned pull request is easy to lose in a list.

## Labels

A pull request carries **one** `type:` label and **zero or more** `status:` labels.

**The `type:` label maps 1:1 to the branch prefix**, so there is no judgment call at labeling
time — only at branching time, where the two questions in [`branching.md`](branching.md)
already settle it. Note `fix/` → `type: bug`: the names differ deliberately.

Full table and colors: [`../reference/labels.md`](../reference/labels.md).
