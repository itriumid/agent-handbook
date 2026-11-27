#!/usr/bin/env node
// Runs the description check from .github/workflows/pull-request-checks.yml against fixed
// descriptions and commit messages, and checks the scaffold copy of the workflow still matches.
// The script lives inline in the workflow, so it is read out of the YAML and run with stand-ins
// for the GitHub API. Run from the repository root: node scripts/test-description-check.mjs

import { readFileSync } from 'node:fs';

const WORKFLOW = '.github/workflows/pull-request-checks.yml';
const SCAFFOLD_WORKFLOW = 'scaffold/common/.github/workflows/pull-request-checks.yml';
const STEP = "- name: Check the description and commits are written for a reader who wasn't there";

// Reads the `script: |` block of one step: every line after it that is blank or indented deeper
// than `script:`, with the block's own indentation removed.
function extractScript(yaml, stepName) {
  const lines = yaml.split('\n');
  const step = lines.findIndex((line) => line.trim() === stepName);
  if (step === -1) throw new Error(`No step "${stepName}" in ${WORKFLOW}`);
  const start = lines.findIndex((line, i) => i > step && /^\s*script:\s*\|\s*$/.test(line));
  const keyIndent = lines[start].search(/\S/);
  const block = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() && line.search(/\S/) <= keyIndent) break;
    block.push(line);
  }
  const indent = block.find((line) => line.trim()).search(/\S/);
  return block.map((line) => line.slice(indent)).join('\n');
}

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
const script = extractScript(readFileSync(WORKFLOW, 'utf8'), STEP);

// Returns the failure message, or null when the check passes.
async function runCheck({ body, commits = ['Add a thing'], user = 'someone', ref = 'chore/x', commitAuthor = 'someone' }) {
  let failure = null;
  const github = {
    rest: { pulls: { get: async () => ({ data: { number: 1, body, user: { login: user }, head: { ref } } }), listCommits: {} } },
    paginate: async () =>
      commits.map((message, i) => ({ sha: `abc${i}def0000`, author: { login: commitAuthor }, commit: { message } })),
  };
  const core = { setFailed: (message) => (failure = message), info: () => {} };
  const context = { repo: { owner: 'owner', repo: 'repo' }, payload: { pull_request: { number: 1 } } };
  await new AsyncFunction('github', 'context', 'core', script)(github, context, core);
  return failure;
}

const CHECKLIST = '---\n\n- [x] Merging with **Create a merge commit**\n- [ ] One `type:` label applied, matching the branch prefix\n';
const describe = ({ why = 'Totals rounded down, so invoices were a cent short.', changed = 'Round half up in `total()`.', verify = 'Run `npm test`; the rounding cases pass.' } = {}) =>
  `## Why\n\n${why}\n\n## What changed\n\n${changed}\n\n## How to verify\n\n${verify}\n\n${CHECKLIST}`;

// `fails`: substrings the failure message must contain. An empty list means the check passes.
const cases = [
  // Descriptions that follow the rule.
  { name: 'a complete description', input: { body: describe() }, fails: [] },
  { name: 'the product\'s user as "you"', input: { body: describe({ changed: 'The list now filters as you type, and your saved filters load first.' }) }, fails: [] },
  { name: 'reply phrasing inside quoted interface text', input: { body: describe({ changed: 'The banner reads "You chose dark mode" and the heading "How we work".' }) }, fails: [] },
  { name: 'reply phrasing inside inline code and a blockquote', input: { body: describe({ changed: 'Removes `I ran` from the log line.\n\n> We decided to keep it.' }) }, fails: [] },
  { name: 'reply phrasing inside an HTML comment', input: { body: describe({ why: '<!-- You asked for this. -->\nTotals rounded down.' }) }, fails: [] },
  { name: 'product copy that counts steps', input: { body: describe({ changed: 'The wizard shows "step 2 of 3" in the header and step 2 of 3 in the title.' }) }, fails: [] },
  { name: 'a How to verify that is only a fenced command', input: { body: describe({ verify: '```bash\nnpm test\n```' }) }, fails: [] },
  { name: 'reply phrasing inside a tilde fence', input: { body: describe({ verify: "~~~\n# I ran this against Postgres 16\nnpm test\n~~~" }) }, fails: [] },
  { name: 'a How to verify that is only ticked items', input: { body: describe({ verify: '- [x] `npm test` passes' }) }, fails: [] },
  { name: '"before merging" as a verification step', input: { body: describe({ verify: 'Before merging, run the migration against a copy of production.' }) }, fails: [] },
  { name: 'a fenced example heading inside a real section', input: { body: describe({ changed: 'The template now reads:\n\n````md\n```\n## Why\n```\n````' }) }, fails: [] },
  { name: 'reply phrasing inside a multi-backtick code span', input: { body: describe({ changed: 'Removes ``I fixed `total` `` from the log.' }) }, fails: [] },
  { name: 'reply phrasing on a blockquote\'s continuation line', input: { body: describe({ changed: '> The old banner said:\nI ran out of space.\n\nThe banner is gone.' }) }, fails: [] },
  { name: 'reply phrasing after a mixed-character line inside a fence', input: { body: describe({ changed: 'The example:\n\n```\n```~~~\nI added a flag\n```' }) }, fails: [] },
  { name: 'a fenced-looking line that is inline code', input: { body: describe({ why: '```total()``` rounded down, so invoices were a cent short.' }) }, fails: [] },
  { name: 'a numbered line that continues a blockquote', input: { body: describe({ changed: '> Previous release notes:\n2. I ran the migration.\n\nThe notes are gone.' }) }, fails: [] },
  { name: 'reply phrasing inside a code span that wraps onto the next line', input: { body: describe(), commits: ['Fix rounding\n\nRemoves the `I ran\nchecks` line from the log.'] }, fails: [] },
  { name: 'reply phrasing continuing a quoted line of inline code', input: { body: describe({ changed: '> ```example```\nI checked the result.\n\nThe example is gone.' }) }, fails: [] },
  { name: 'a Dependabot pull request without headings', input: { body: 'Bumps actions/checkout from 6 to 7.', user: 'dependabot[bot]', commitAuthor: 'dependabot[bot]', commits: ['Bump actions/checkout\n\nI ran nothing.'] }, fails: [] },
  { name: 'a revert made by GitHub\'s button', input: { body: 'Reverts owner/repo#12', ref: 'revert-12-fix/rounding' }, fails: [] },

  // Descriptions that break it.
  { name: 'the untouched template', input: { body: readFileSync('scaffold/common/.github/pull_request_template.md', 'utf8') }, fails: ['"## Why" is empty', '"## What changed" is empty', '"## How to verify" is empty'] },
  { name: 'a missing heading', input: { body: '## Why\n\nTotals rounded down.\n\n## What changed\n\nRound half up.\n' }, fails: ['no "## How to verify" heading'] },
  { name: 'a non-standard heading in place of How to verify', input: { body: describe().replace('## How to verify', '## Test plan') }, fails: ['no "## How to verify" heading'] },
  { name: 'a heading that exists only inside a fence', input: { body: '## Why\n\nTotals rounded down.\n\n## What changed\n\n```\n## How to verify\n```\n' }, fails: ['no "## How to verify" heading'] },
  { name: 'a heading inside a longer fence with a shorter one in it', input: { body: '## Why\n\nTotals.\n\n## What changed\n\n````\n```\n## How to verify\n```\n````\n' }, fails: ['no "## How to verify" heading'] },
  { name: 'a Why that is only an empty fence', input: { body: describe({ why: '```\n```' }) }, fails: ['"## Why" is empty'] },
  { name: 'a "before merging" note in a section after How to verify', input: { body: describe() + '\n## Deployment\n\nBefore merging, rename the deployment.\n' }, fails: ['has a "before merging" note outside How to verify'] },
  { name: 'a merge-order note in a section after How to verify', input: { body: describe() + '\n## Notes\n\nMerge #12 first.\n' }, fails: ['has a merge-order note outside How to verify'] },
  { name: 'an open checkbox inside How to verify', input: { body: describe({ verify: '- [ ] Run the regression suite' }) }, fails: ['has an unfinished task: "- [ ] Run the regression suite"'] },
  { name: 'reply phrasing after an unclosed double backtick', input: { body: describe({ changed: 'Removes ``I ran` from the log.' }) }, fails: ['narrates as "I": "I ran"'] },
  { name: 'an open checkbox right after a blockquote', input: { body: describe({ changed: '> Previous behavior\n- [ ] Run the regression suite' }) }, fails: ['has an unfinished task: "- [ ] Run the regression suite"'] },
  { name: 'reply phrasing after a quoted heading', input: { body: describe({ changed: '> ## Example\nI ran the regression suite.' }) }, fails: ['narrates as "I": "I ran"'] },
  { name: 'an unclosed backtick before a blank line', input: { body: describe({ changed: 'Removes `I ran\n\nfrom the log`.' }) }, fails: ['narrates as "I": "I ran"'] },
  { name: 'reply phrasing between unclosed backticks either side of a fence', input: { body: describe(), commits: ['Fix rounding\n\nAn unmatched `opener.\n```text\n```\nI checked the result.\nAn unmatched `closer.'] }, fails: ['narrates as "I": "I checked"'] },
  { name: 'reply phrasing between unclosed backticks in two list items', input: { body: describe(), commits: ['Fix rounding\n\n- `one\n- I checked two`'] }, fails: ['narrates as "I": "I checked"'] },
  { name: 'reply phrasing after a quoted rule written with asterisks', input: { body: describe({ changed: '> ***\nI checked the result.' }) }, fails: ['narrates as "I": "I checked"'] },
  { name: 'a decision reported as "you"', input: { body: describe({ why: 'You chose scrambled backups by default.' }) }, fails: ['reports a decision as "you" or "we": "You chose"'] },
  { name: 'the requester addressed', input: { body: describe({ why: 'Per your feedback, rounding is fixed.' }) }, fails: ['addresses the requester'] },
  { name: 'narration as "I"', input: { body: describe({ verify: "I ran the job's commands against Postgres 16." }) }, fails: ['narrates as "I": "I ran"'] },
  { name: 'narration as "we"', input: { body: describe({ changed: 'We tried a lookup table first.' }) }, fails: ['narrates as "we": "We tried"'] },
  { name: 'a reference to the conversation', input: { body: describe({ why: 'As discussed, totals round half up.' }) }, fails: ['refers to a conversation'] },
  { name: 'a "worth knowing before merging" note', input: { body: describe({ changed: 'Round half up.\n\nTwo things worth knowing before merging: the cache is cold.' }) }, fails: ['has a "worth knowing" note', 'has a "before merging" note outside How to verify'] },
  { name: 'a score from the run', input: { body: describe({ changed: 'The third concept (32/40) is the highest so far.' }) }, fails: ['reports a score from the run'] },
  { name: 'session narration', input: { body: describe({ changed: 'This round fixes the contrast found in the fifth review.' }) }, fails: ['narrates the session'] },
  { name: 'an open checkbox', input: { body: describe({ changed: 'Round half up.\n\n- [ ] Rename the deployment' }) }, fails: ['has an unfinished task: "- [ ] Rename the deployment"'] },
  { name: 'a to-do list', input: { body: describe({ changed: 'Round half up.\n\n**Next steps:** wire up the export.' }) }, fails: ['lists unfinished work'] },
  { name: 'a merge-order note', input: { body: describe({ why: 'Stacked on #12, so merge that first.' }) }, fails: ['has a merge-order note outside How to verify'] },

  // Commit messages: phrasing only, no headings required.
  { name: 'a plain commit message', input: { body: describe(), commits: ['Round totals half up\n\nTotals rounded down, so invoices were a cent short.'] }, fails: [] },
  { name: 'a commit message written as a reply', input: { body: describe(), commits: ['Round totals half up', 'Fix rounding\n\nI ran the suite again.'] }, fails: ['Commit abc1def: narrates as "I"'] },
];

let failed = 0;
for (const { name, input, fails } of cases) {
  const message = await runCheck(input);
  const problems = [];
  if (!fails.length && message) problems.push(`expected a pass, got:\n${message}`);
  if (fails.length && !message) problems.push('expected a failure, got a pass');
  for (const expected of fails) {
    if (message && !message.includes(expected)) problems.push(`expected "${expected}" in:\n${message}`);
  }
  if (problems.length) {
    failed++;
    console.log(`FAIL  ${name}\n      ${problems.join('\n      ').replace(/\n/g, '\n      ')}`);
  } else {
    console.log(`ok    ${name}`);
  }
}

if (readFileSync(WORKFLOW, 'utf8') !== readFileSync(SCAFFOLD_WORKFLOW, 'utf8')) {
  failed++;
  console.log(`FAIL  ${SCAFFOLD_WORKFLOW} differs from ${WORKFLOW}; copy one over the other.`);
} else {
  console.log(`ok    ${SCAFFOLD_WORKFLOW} matches ${WORKFLOW}`);
}

console.log(`\n${cases.length + 1 - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
