import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoCodeTab, DemoExampleBlockComponent } from '../../../../shared/demo-example-block/demo-example-block.component';
import { KnBottomSheetInlineHostContainerComponent } from './code/bottom-sheet-inline-host-container.component';

@Component({
  selector: 'kn-bottom-sheet-inline-host',
  imports: [DemoExampleBlockComponent, KnBottomSheetInlineHostContainerComponent],
  templateUrl: './bottom-sheet-inline-host.component.html',
  styleUrl: './bottom-sheet-inline-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetInlineHostComponent {
  protected readonly inlineExampleTabs: DemoCodeTab[] = [
    {
      label: 'bottom-sheet.component.ts',
      language: 'typescript',
      code: `
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { KnBottomSheetComponent } from 'kalina';

@Component({
  selector: 'kn-bottom-sheet-inline-host-container',
  imports: [KnBottomSheetComponent],
  templateUrl: './bottom-sheet-inline-host-container.component.html',
  styleUrl: './bottom-sheet-inline-host-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnBottomSheetInlineHostContainerComponent {
  @ViewChild('sheet') private sheet?: KnBottomSheetComponent;

  protected readonly sheetData = new Date().toDateString();

  protected openSheet(): void {
    this.sheet?.open();
  }
}
      `,
    },
    {
      label: 'bottom-sheet.component.html',
      language: 'html',
      code: `
<button type="button" class="demo-btn" (click)="openSheet()">Open</button>

<kn-bottom-sheet #sheet [data]="sheetData">
  <div header class="sheet-header-demo">
    <h2 class="sheet-title">Title</h2>
    <p class="sheet-subtitle">Subtitle</p>
  </div>

  <div class="sheet-body sheet-body--text">
    <p>
      Today is {{ sheet.knData }}!
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
      aute irure
      dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </div>

  <div footer class="sheet-footer-demo">
    <button type="button" class="demo-btn">Confirm</button>
    <button type="button" class="demo-btn demo-btn--primary">Reject</button>
  </div>
</kn-bottom-sheet>
      `,
    },
  ];
}
