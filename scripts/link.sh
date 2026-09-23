#!/usr/bin/env bash
# Links this handbook into a repository as `.handbook`, pointing at this repository's root —
# conventions/, decisions/, and everything else this repository shares, all reachable from one
# link.
#
# The script resolves its own location, so the two repositories don't need any particular
# layout relative to each other — clone agent-handbook anywhere, then:
#
#   ~/wherever/agent-handbook/scripts/link.sh path/to/target-repository
#
# or, from inside the target repository, with no argument:
#
#   ~/wherever/agent-handbook/scripts/link.sh
#
# `.handbook` is gitignored rather than committed — where the handbook is cloned is a property
# of the machine, not of the project. Re-run this after moving either repository, on a fresh
# clone, or if `.handbook` ever looks missing or dangling (it force-overwrites an existing link).

set -euo pipefail

handbook="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target="${1:-.}"

cd "$target"

if [ ! -d .git ]; then
  echo "error: $target is not a git repository" >&2
  exit 1
fi

if git ls-files --error-unmatch .handbook >/dev/null 2>&1; then
  echo "warning: .handbook is committed here — untracking it (the working copy is kept)" >&2
  git rm --cached -q .handbook
fi

ln -sfn "$handbook" .handbook

if [ ! -f .gitignore ] || ! grep -qx '.handbook' .gitignore; then
  # Guard against appending onto a last line that has no trailing newline.
  if [ -s .gitignore ] && [ -n "$(tail -c1 .gitignore)" ]; then
    printf '\n' >> .gitignore
  fi
  printf '%s\n' '.handbook' >> .gitignore
fi

echo "Linked .handbook -> $handbook"
echo "Verify: ls .handbook/conventions/rules/"
