# 0002. Share the games' pixel font through a git submodule

Status: accepted

## Context

Felterra: Nine Seas drew its interface in its own pixel font: every glyph typed as text in a
GDScript class, so letters land on whole pixels at any scale and nothing depends on an outside
font file. Felterra: Tall Order copied it, and within a day the copies had drifted: Tall Order
needed angle brackets and arrows that Nine Seas didn't have. Every game we make after them will
want the same font, and a glyph fixed in one copy stays broken in the others.

Ways to share it that we considered:

- **Copies kept in step by hand**, or by a check that compares them: no new machinery, but
  still a copy per game to edit.
- **A package from a registry**, as the palettes are (decision 0001): Godot has no package
  manager we'd want to depend on, and the Asset Library is a catalog, not versioned
  dependencies.
- **A git submodule**: the usual way a Godot add-on is shared. Each game pins a commit of the
  font's repository, so an update is a deliberate change the game's own tests pass.

## Decision

The font is **Itrium Pixel**, in its own repository,
[itriumid/pixel-font](https://github.com/itriumid/pixel-font), as a Godot add-on: the
`PixelFont` class at the repository's root.

- **Games take it in as a git submodule at `addons/itrium_pixel_font`**, and pin the commit
  they use. A game doesn't keep a copy of its own.
- **A character a game prints is added to the font**, glyph and all, and to the font's list of
  characters its tests require, so nothing falls back to a question mark in any game.
- **Its tests are a required check** on every pull request there.
- **It's licensed under the SIL Open Font License 1.1**, with "Itrium" as a reserved font
  name: free to embed in anything, our GPL games and our sites included, and a changed version
  can't carry the name.

## Consequences

- A glyph is drawn once, in one pull request, then taken by each game when it updates its
  submodule.
- Cloning a game takes `--recurse-submodules`, or a `git submodule update --init` after; a game's
  README and its Continuous Integration checkout have to say so.
- Changing or removing a glyph changes every game that updates, so the font's pull requests say
  so, and its specimen is redrawn.
- The font is for games, inside Godot. Our sites keep Plus Jakarta Sans; using Itrium Pixel on
  the web would need it exported to a web font, which is a separate decision and a new build
  dependency.
