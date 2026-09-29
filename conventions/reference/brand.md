# Brand

Itrium's colors and how to use them, for anything these projects produce: app interfaces,
diagrams, documents, labels, social images. The logo files and the full brand guide are kept
with the brand assets, not in this handbook.

## Colors

The palette is called **Rhodonite**, after the mineral: graphite with pink running through it.
It's Itrium's own palette and the default in everything we make; our free applications can
offer others as a choice (see [Other palettes](#other-palettes)).

| Name | Hex | Use |
|---|---|---|
| Graphite | `#2B2B2B` | Text on light backgrounds, dark backgrounds, the logo's tile |
| Pastel pink | `#FEBFCA` | The one accent color: what's playing, what has focus, the primary action |
| Off-white | `#F2F2F2` | Text on graphite |
| Muted gray | `#AAAAAA` on dark, `#6B6B6B` on light | Secondary text |

Interfaces add their own neutral surfaces and borders around these; Honk's README lists its
design tokens as an example.

## Rules

- **Text on pink is always graphite**, never white.
- **Pink is never text on a light background.** It's too light to read there; use it for
  fills and accents only.
- **Pink means something.** Use it for one thing at a time (playing, focus, or the primary
  action), not as decoration.
- **Graphite, not black.** Use `#2B2B2B`, not `#000000`.
- **Text meets level AA of the Web Content Accessibility Guidelines** (4.5:1 for body text) on
  every surface it sits on, not only the page background. Check raised surfaces too: the old
  muted gray `#9A9A9A` passed on graphite but failed on `#343434` cards.
- **Focus outlines reach 3:1.** Pink works on dark backgrounds; on light ones it's 1.5:1 and
  nearly invisible, so light mode outlines focus in graphite.
- **Text on a pink tint still meets 4.5:1.** When pink tints a surface behind text (Honk's
  playing pads), turn the tint down until it does.

## Other palettes

Our free applications can let people pick another palette, the way Honk offers adapted
[Catppuccin](https://catppuccin.com) flavors.

**Only our free applications.** Everything else has one palette and no picker:

- **Client work** uses the client's brand, not ours and not a palette menu.
- **Itrium's own sites**, itrium.id and the web tools on tools.itrium.id, use Rhodonite only.
  They're the brand, not a preference.

When a free application offers palettes:

- **Rhodonite stays the default**, and it's what its screenshots and social images show.
- **Every palette has a light and a dark version.** The theme setting (System, Light, Dark)
  picks between them, and follows the system unless someone chooses otherwise.
- **Every palette meets the same bar as Rhodonite**, in both versions: 4.5:1 for text and
  secondary text on every surface, for text on the accent, and for text on an accent tint;
  3:1 for the focus outline. A popular palette is adapted until it passes, not shipped as it
  comes, and the adaptations are written down next to the colors.
- **A test checks it.** An application that offers palettes checks every one in Continuous
  Integration, so a failing color can't be merged. Honk's `tests/contrast.test.mjs` is the
  model: it reads the stylesheet and works out each palette in every theme state.
- **The accent keeps its meaning.** Each palette has one accent, used for the same things as
  pink (what's playing, what has focus, the primary action), with its own on-accent color for
  text on it.
- **Credit the source.** Name the palette it comes from and link to it, in the application's
  README.

## The logo

An element tile: atomic number **39** in the corner, symbol **It** in the middle. Itrium is the
Indonesian word for yttrium, element 39. Below 48 px, use the compact version without the "39".
Don't recolor, stretch or redraw it; use the exported files.
