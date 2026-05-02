export type KnThemeMode = 'light' | 'dark';

export interface KnThemeOptions {
  /**
   * Attribute placed on <html> to drive theme CSS selectors.
   * Default: "data-kn-theme"
   */
  attribute?: string;
  /**
   * Target element for theme attribute. Default: document.documentElement
   */
  target?: HTMLElement;
}

export function setKnTheme(mode: KnThemeMode, options: KnThemeOptions = {}): void {
  const attribute = options.attribute ?? 'data-kn-theme';
  const target = options.target ?? document.documentElement;
  target.setAttribute(attribute, mode);
}

