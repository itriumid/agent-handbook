# Cleaning up after an agent mistake

A lookup procedure, not a rule — consult it when an agent has already done something it
shouldn't have, despite [`../rules/ai-agents.md`](../rules/ai-agents.md).

| Situation | Do this |
|---|---|
| A secret may have leaked — echoed, committed, or sent somewhere external | Rotate it immediately, wherever it's used. Don't wait to confirm exposure first; rotating something that turned out to be safe costs little, leaving something exposed costs a lot. In a public repository, assume it was scraped. |
| History looks rewritten or lost — a force-push, an amend, a reset | Check `git reflog` on the machine that did it before assuming anything is gone. The prior tip is usually still there; local reflog entries persist for around 90 days by default. |
| An unwanted commit, push, pull request, comment, or message went out | Don't just delete or close it quietly. Leave a note on the pull request or issue saying what happened, so the history still makes sense when read back later. |
| A check was disabled or weakened to get past a failure — a suppressed lint rule, a skipped test, a loosened assertion | Revert the suppression, restore the check, and re-verify anything that merged while it was silenced. |
| A repository setting or ruleset changed unexpectedly | Re-run `scripts/configure-repository.sh` against it — it's idempotent and puts the standard configuration back. |
| Not sure what actually happened | Read the agent's session transcript before trying to reconstruct events from artifacts alone — most tools keep one, and it's the fastest way to find out what was actually asked for. |

**Fix the rule, not just the damage.** If a tool did something nobody expected it could, that's
worth a pull request here — it's how the rules in `ai-agents.md` end up covering the next case
instead of only this one.
