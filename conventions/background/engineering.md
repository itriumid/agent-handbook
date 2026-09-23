# Why the engineering conventions are what they are

**Skip this unless you're changing a rule.** Nothing here is instructions — it is the record
of decisions already made, kept so they aren't relitigated and so any proposed change knows
what the current rule was protecting against.

The rules themselves are in [`../rules/engineering.md`](../rules/engineering.md).

## Why dependency and runtime updates are small and regular, not deferred

A version gap that's left alone doesn't stay the same size — it compounds. Breaking changes
stack on breaking changes, and the eventual catch-up stops being routine maintenance and
becomes a migration project with its own risk and its own timeline. Bumping in small, regular
batches keeps the blast radius of each update small enough to review like any other change,
instead of turning "update Node" into something that gets postponed precisely because it's
grown too large to fit in a normal pull request.

Personal projects are especially prone to this: they sit untouched for months, and the first
change after a long gap shouldn't also have to be a migration.

## Why explicit names

An abbreviation saves a few keystrokes once and costs a moment of decoding every time it's read
afterwards — and code is read far more often than it's written. Abbreviations also aren't
unique: `cfg`, `conf`, `config` and `configuration` all end up in the same codebase, and
searching for one misses the rest.

Framework-dictated names are exempt because renaming them isn't an option — the tool looks for
that exact filename.
