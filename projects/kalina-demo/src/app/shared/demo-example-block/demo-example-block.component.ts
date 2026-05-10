import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { CodeHighlightComponent } from '../code-highlight/code-highlight.component';

export type DemoCodeTab = {
  label: string;
  language: 'typescript' | 'javascript' | 'css' | 'html';
  code: string;
};

@Component({
  selector: 'kn-demo-example-block',
  standalone: true,
  imports: [NgIf, NgFor, CodeHighlightComponent],
  template: `
    <section class="ex">
      <header class="ex__header">
        <div class="ex__title-wrap">
          <h2 class="ex__title">{{ title }}</h2>
          <p *ngIf="subtitle" class="ex__subtitle">{{ subtitle }}</p>
        </div>
      </header>

      <div class="ex__demo">
        <ng-content />
      </div>

      <footer class="ex__footer">
        <button
          type="button"
          class="ex__toggle"
          [attr.aria-expanded]="isCodeOpen()"
          (click)="toggleCode()"
          title="Toggle code"
        >
          <span class="ex__toggle-icon" aria-hidden="true">
            <span *ngIf="!isCodeOpen()">&lt;&gt;</span>
            <span *ngIf="isCodeOpen()">&lt;/&gt;</span>
          </span>
          <span class="ex__toggle-text">{{ isCodeOpen() ? 'Hide code' : 'Show code' }}</span>
        </button>
      </footer>

      <div *ngIf="isCodeOpen()" class="ex__code">
        <div *ngIf="tabs.length" class="ex__tabs" role="tablist" aria-label="Code tabs">
          <button
            *ngFor="let t of tabs; let i = index"
            type="button"
            class="ex__tab"
            [class.ex__tab--active]="activeTab() === i"
            role="tab"
            [attr.aria-selected]="activeTab() === i"
            (click)="activeTab.set(i)"
          >
            {{ t.label }}
          </button>
        </div>

        <kn-code-highlight
          *ngIf="tabs.length"
          class="ex__code-block"
          [language]="tabs[activeTab()].language"
          [code]="tabs[activeTab()].code"
        />
      </div>
    </section>
  `,
  styleUrl: './demo-example-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoExampleBlockComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
  @Input() tabs: DemoCodeTab[] = [];

  protected readonly isCodeOpen = signal(false);
  protected readonly activeTab = signal(0);

  protected toggleCode(): void {
    this.isCodeOpen.update((v) => !v);
  }
}

