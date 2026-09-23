# Decisions

Technology and infrastructure choices that affect more than one project — a default stack, a
hosting platform, a shared tool. A single project's own internal architecture choices stay in
that project.

**Test:** would getting this wrong affect more than one project? If it only affects one, it
belongs there instead — see [`AGENTS.md`](../AGENTS.md).

## Format

One file per decision: `NNNN-short-slug.md`, numbered sequentially. A number is never reused
or renumbered, even once the decision it names is superseded.

```markdown
# NNNN. Title

Status: proposed | accepted | superseded by NNNN

## Context

## Decision

## Consequences
```

A superseded decision isn't deleted or edited into something else — a new, separately numbered
file records the new decision and says what it supersedes; the old file's Status line is
updated to point at it. The history of *why* stays readable either way.

Label the pull request `area: decisions`.
