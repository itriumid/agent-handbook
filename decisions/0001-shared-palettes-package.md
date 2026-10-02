# 0001. Share palettes through an npm package

Status: accepted

## Context

Honk offered four palettes (Rhodonite and three adapted Catppuccin flavors), each with a light
and a dark version, a picker for them, and a test that checks every one meets level AA in every
theme state. Hindsight, the second free application, needs the same thing, and every one we
make after it will too.

Copying it means every color fix, new palette and checker improvement happens once per
application, and the copies drift: Hindsight already carried Honk's tokens with a comment about
Honk's sound pads. Colors are also where drift does harm we can't see in review, because a pair
of hex values that differs by one digit can fail contrast.

Ways to share it that we considered:

- **A git dependency** on a tagged commit: no registry, but no provenance, no ordinary version
  ranges, and tooling (Dependabot, `pnpm outdated`) handles it worse.
- **Copies kept in step by a check:** no dependency, but still two copies to edit by hand.
- **An npm package:** a normal dependency, versioned with semver, published with a provenance
  attestation from Continuous Integration.

## Decision

Palettes live in **`@itrium/palettes`** ([itriumid/palettes](https://github.com/itriumid/palettes)),
published to npm under the `itrium` organization. It holds the color tokens only (spacing, radii
and fonts stay in each application), the palette list, the theme store and its two Svelte
pickers, and the contrast checker.

- **Every version on npm passes the check**: it's a required check on every pull request, and
  the release workflow runs it again before publishing.
- **Versions are published by the repository's release workflow** through npm's trusted
  publishing, with a provenance attestation. No npm token is stored. Only the first version was
  published by hand, since npm can only trust a workflow for a package that already exists.
- **Applications pin an exact version** and run the package's checker against their own
  stylesheet and components in their own Continuous Integration, so an update is a pull request
  their own checks pass.

## Consequences

- A palette or color change is one pull request in one place, then an update pull request per
  application.
- Renaming or removing a token is a breaking change for every application at once; the package
  treats tokens as its API (a minor version before 1.0.0, a major one after).
- Testing an unreleased change in an application means installing a packed tarball, not editing
  the copy in place (the package's `CONTRIBUTING.md` says how).
- Itrium has a second public registry presence to look after, alongside the Homebrew tap: the
  npm organization's members and its two-factor authentication.
- Client work doesn't use this package: it uses the client's brand
  (`conventions/reference/brand.md`, Other palettes).
