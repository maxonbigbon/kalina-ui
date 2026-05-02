import { Component, computed, effect, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { setKnTheme, type KnThemeMode } from 'kalina';

@Component({
  selector: 'kn-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('kalina');
  protected readonly theme = signal<KnThemeMode>('light');

  protected readonly nav = computed(() => [
    { label: 'Table', route: '/table' },
    { label: 'Bottom sheet', route: '/bottom-sheet' },
  ]);

  constructor() {
    effect(() => setKnTheme(this.theme()));
  }

  protected toggleTheme(): void {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }
}
