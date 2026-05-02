# Kalina UI Kit (Angular)

Angular UI kit workspace:

- `projects/kalina/`: UI kit library (`package.json` name: `kalina`)
- `projects/kalina-demo/`: demo app with sidebar + theme toggle

## Requirements

- Node.js 22+
- Angular CLI 21+

## Commands

### Run demo

```bash
ng serve kalina-demo
```

If port `4200` is busy:

```bash
ng serve kalina-demo --port 4201
```

### Build library

```bash
ng build kalina
```

Build output: `dist/kalina/` (includes `theme/**/*.scss` as published assets).

## Theming

Kalina theming is token-based:

- **Source of truth**: SCSS token maps (`projects/kalina/src/theme/themes/_light.scss`, `_dark.scss`)
- **Runtime switching**: CSS Custom Properties emitted into `:root[data-kn-theme='light' | 'dark']`

### How switching works

Demo app sets theme attribute on `<html>`:

- `data-kn-theme="light"` or `data-kn-theme="dark"`

At runtime you can switch via exported helper:

- `setKnTheme('light' | 'dark')` from `kalina`

### Custom theme

You can create your own selector and emit tokens with the mixin:

```scss
@use 'kalina/theme/abstracts/mixins' as m;

$my-tokens: (
  'color-bg': #0b1020,
  'color-primary': #ff4d8d
);

@include m.kn-theme($my-tokens, ":root[data-kn-theme='brand']");
```

Then set `data-kn-theme="brand"` at runtime.

## Schematics / prefix

Workspace schematics are configured to generate **standalone** components with:

- prefix: `kn`
- styles: `scss`

