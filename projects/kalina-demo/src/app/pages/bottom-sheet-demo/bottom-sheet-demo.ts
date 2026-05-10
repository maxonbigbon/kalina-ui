import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { KnBottomSheetService } from 'kalina';

import { KnBottomSheetDemoComponet } from './components/bottom-sheet/bottom-sheet.component';
import { DemoCodeTab, DemoExampleBlockComponent } from '../../shared/demo-example-block/demo-example-block.component';

@Component({
  selector: 'kn-bottom-sheet-demo-page',
  imports: [DemoExampleBlockComponent],
  templateUrl: './bottom-sheet-demo.html',
  styleUrl: './bottom-sheet-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetDemoPage {
  private bottomSheetService = inject(KnBottomSheetService);
  protected readonly inlineOpen = signal(false);

  protected openSheet(): void {
    this.bottomSheetService.open(KnBottomSheetDemoComponet, { data: 'Outside creation context' });
  }

  protected openInline(): void {
    this.inlineOpen.set(true);
  }

  protected closeInline(): void {
    this.inlineOpen.set(false);
  }

  protected readonly serviceExampleTabs: DemoCodeTab[] = [
    {
      label: 'bottom-sheet-demo.ts',
      language: 'typescript',
      code: `import { KnBottomSheetService } from 'kalina';
import { KnBottomSheetDemoComponet } from './components/bottom-sheet/bottom-sheet.component';

export class BottomSheetDemoPage {
  private bottomSheetService = inject(KnBottomSheetService);

  openSheet(): void {
    this.bottomSheetService.open(KnBottomSheetDemoComponet, { data: 'Outside creation context' });
  }
}`,
    },
    {
      label: 'bottom-sheet.component.html',
      language: 'html',
      code: `<kn-bottom-sheet #bottomSheet>
  <div header class="sheet-header-demo">
    <h2 class="sheet-title">Пример</h2>
    <p class="sheet-subtitle">Демо со скроллом внутри контента.</p>
  </div>

  <div class="sheet-body sheet-body--text">
    {{ bottomSheet.knData }}
    <p>...</p>
  </div>

  <div footer class="sheet-footer-demo">
    <button type="button" class="demo-btn">Secondary</button>
    <button type="button" class="demo-btn demo-btn--primary">Primary</button>
  </div>
</kn-bottom-sheet>`,
    },
  ];

  protected readonly inlineExampleTabs: DemoCodeTab[] = [
    {
      label: 'bottom-sheet-demo.html',
      language: 'html',
      code: `<button type="button" class="demo-btn" (click)="openInline()">Open inline</button>

<kn-bottom-sheet
  [isOpen]="inlineOpen()"
  (isOpenChange)="inlineOpen.set($event)"
  (closed)="closeInline()"
>
  <div header class="sheet-header-demo">
    <h2 class="sheet-title">Inline example</h2>
    <p class="sheet-subtitle">Управление через isOpen + isOpenChange.</p>
  </div>
  <div class="sheet-body">
    <p>Контент внутри страницы.</p>
  </div>
</kn-bottom-sheet>`,
    },
    {
      label: 'bottom-sheet-demo.ts',
      language: 'typescript',
      code: `export class BottomSheetDemoPage {
  readonly inlineOpen = signal(false);

  openInline(): void {
    this.inlineOpen.set(true);
  }

  closeInline(): void {
    this.inlineOpen.set(false);
  }
}`,
    },
  ];
}

