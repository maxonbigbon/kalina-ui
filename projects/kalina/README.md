# Kalina (library)

Standalone Angular UI kit library.

## Build

```bash
ng build kalina
```

## Public API

Exports are defined in `projects/kalina/src/public-api.ts` (components + theming helper).

## Styles / theme assets

Theming SCSS lives in `projects/kalina/src/theme/` and is shipped as build assets to `dist/kalina/theme/`.

Typical consumption:

```scss
@use 'kalina/theme/kalina-theme';
```

