#!/usr/bin/env bash
# Applies the standard GitHub configuration to a repository: merge settings, and a ruleset on
# the default branch. See **Merging** in conventions/rules/branching.md for what each setting is
# and conventions/background/git-workflow.md for why.
#
#   scripts/configure-repository.sh owner/repository
#
# or, from inside a clone, with no argument (reads the `origin` remote). Needs an authenticated
# `gh`. Idempotent — safe to re-run, and re-running is how drifted settings get put back.
#
# The ruleset requires the `Branch name` and `Commit messages` checks from
# scaffold/common/.github/workflows/pull-request-checks.yml. A pull request that adds that workflow can still merge under the ruleset:
# pull_request workflows run from the pull request's own copy of the file.
#
# Rulesets need a public repository, or a paid plan for a private one. On a private repository
# on GitHub Free the merge settings still apply and the ruleset step is reported as skipped.

set -euo pipefail

repository="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
ruleset_name="main"

echo "Configuring $repository"

gh api --silent -X PATCH "repos/$repository" \
  -F allow_merge_commit=true \
  -F allow_squash_merge=false \
  -F allow_rebase_merge=false \
  -f merge_commit_title=PR_TITLE \
  -f merge_commit_message=PR_BODY \
  -F delete_branch_on_merge=true
echo "  merge settings: merge commits only, title and description, delete head branches"

ruleset=$(cat <<JSON
{
  "name": "$ruleset_name",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [],
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false,
        "allowed_merge_methods": ["merge"]
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [{ "context": "Branch name" }, { "context": "Commit messages" }]
      }
    }
  ]
}
JSON
)

existing_id=$(gh api "repos/$repository/rulesets" -q ".[] | select(.name == \"$ruleset_name\") | .id" 2>/dev/null || true)

if [ -n "$existing_id" ]; then
  method=PUT
  endpoint="repos/$repository/rulesets/$existing_id"
else
  method=POST
  endpoint="repos/$repository/rulesets"
fi

if output=$(printf '%s' "$ruleset" | gh api -X "$method" "$endpoint" --input - 2>&1); then
  echo "  ruleset '$ruleset_name' on the default branch: pull request required, merge only,"
  echo "  'Branch name' and 'Commit messages' checks required, no force pushes, no deletion, no bypass"
elif [ "$(gh repo view "$repository" --json visibility -q .visibility)" = "PRIVATE" ]; then
  echo "  ruleset skipped: private repositories need a paid plan for rulesets" >&2
else
  echo "error: could not apply the ruleset:" >&2
  echo "$output" >&2
  exit 1
fi
